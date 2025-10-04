
'use client';

import { useEffect, useState } from 'react';
import { TextField, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

interface AddressAutocompleteProps {
  address: string;
  setAddress: (address: string) => void;
  error?: boolean;
  helperText?: string;
  onAddressDataChange?: (data: {
    business_name: string;
    phone_number: string;
    street_address: string;
    locality: string;
    country_code: string;
    first_name: string;
    last_name: string;
    postal_code: string;
    administrative_area: string;
    formatted_address: string
  }) => void;
}

export default function AddressAutocomplete({
  address,
  setAddress,
  error = false,
  helperText = '',
  onAddressDataChange,
}: AddressAutocompleteProps) {
  const [loading, setLoading] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchPlaceDetails = (placeId: string) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      {
        placeId,
        fields: [
          'place_id',
          'name',
          'url',
          'website',
          'formatted_address',
          'international_phone_number',
          'formatted_phone_number',
          'opening_hours',
          'rating',
          'user_ratings_total',
          'business_status',
          'types',
          'address_components',
        ],
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
          const addressComponents = result.address_components || [];

          // Normalize address for validateAddress regex
          const streetNumber = addressComponents.find((c) => c.types.includes('street_number'))?.long_name || '';
          const route = addressComponents.find((c) => c.types.includes('route'))?.long_name || '';
          const city =
            addressComponents.find((c) => c.types.includes('locality'))?.long_name ||
            addressComponents.find((c) => c.types.includes('sublocality_level_1'))?.long_name ||
            '';
          const postalCode = addressComponents.find((c) => c.types.includes('postal_code'))?.long_name || '';
          const administrativeArea = addressComponents.find((c) => c.types.includes('administrative_area_level_1'))?.long_name || '';

          const normalizedAddress = postalCode
            ? `${streetNumber} ${route}, ${city}, ${postalCode}`.replace(/\s+/g, ' ').trim()
            : result.formatted_address || '';


          // Update address
          setAddress(normalizedAddress);

          // Extract required address fields
          const addressDetails = {
            business_name: result.name || '',
            phone_number: result.international_phone_number || result.formatted_phone_number || '',
            street_address: `${streetNumber} ${route}`.trim(),
            locality: city,
            country_code: addressComponents.find((c) => c.types.includes('country'))?.short_name || '',
            first_name: '', // Not provided by Places API
            last_name: '', // Not provided by Places API
            postal_code: postalCode,
            administrative_area: administrativeArea,
            formatted_address: result.formatted_address || ''  // ✅ FIXED
          };

          // Update parent with address details
          if (onAddressDataChange) {
            onAddressDataChange(addressDetails);
          }

          // Store in sessionStorage
          const updatedDetails = {
            address: normalizedAddress,
            latLng: { lat: result.geometry?.location?.lat(), lng: result.geometry?.location?.lng() },
            address_components: addressComponents,
            business_name: result.name || '',
            phone_number: result.international_phone_number || result.formatted_phone_number || '',
            website: result.website || '',
            rating: result.rating || '',
            total_ratings: result.user_ratings_total || '',
            hours: result.opening_hours?.weekday_text || [],
            business_status: result.business_status || '',
            categories: result.types || [],
          };
          sessionStorage.setItem('placeDetailsExtract', JSON.stringify(updatedDetails));
          sessionStorage.setItem('addressDetails', JSON.stringify(addressDetails));

          console.log('Place Details:', result, 'Normalized Address:', normalizedAddress, 'Address Details:', addressDetails);
        } else {
          console.error('Place details fetch failed:', status);
        }
        setLoading(false);
      }
    );
  };

  const handleSelect = async (selectedAddress: string) => {
    try {
      setLoading(true);
      const results = await geocodeByAddress(selectedAddress);
      const placeId = results[0].place_id;
      if (placeId) {
        fetchPlaceDetails(placeId); // Fetch detailed business info
      } else {
        // Fallback to basic address components
        const latLng = await getLatLng(results[0]);
        const addressComponents = results[0].address_components || [];

        const streetNumber = addressComponents.find((c) => c.types.includes('street_number'))?.long_name || '';
        const route = addressComponents.find((c) => c.types.includes('route'))?.long_name || '';
        const city =
          addressComponents.find((c) => c.types.includes('locality'))?.long_name ||
          addressComponents.find((c) => c.types.includes('sublocality_level_1'))?.long_name ||
          '';
        const postalCode = addressComponents.find((c) => c.types.includes('postal_code'))?.long_name || '';
        const administrativeArea = addressComponents.find((c) => c.types.includes('administrative_area_level_1'))?.long_name || '';

        const normalizedAddress = postalCode
          ? `${streetNumber} ${route}, ${city}, ${postalCode}`.replace(/\s+/g, ' ').trim()
          : selectedAddress;

        setAddress(normalizedAddress);

        const addressDetails = {
          business_name: '',
          phone_number: '',
          street_address: `${streetNumber} ${route}`.trim(),
          locality: city,
          country_code: addressComponents.find((c) => c.types.includes('country'))?.short_name || '',
          first_name: '',
          last_name: '',
          postal_code: postalCode,
          administrative_area: administrativeArea,
        };

        if (onAddressDataChange) {
          onAddressDataChange(addressDetails);
        }

        const updatedDetails = {
          address: normalizedAddress,
          latLng,
          address_components: addressComponents,
        };
        sessionStorage.setItem('placeDetailsExtract', JSON.stringify(updatedDetails));
        sessionStorage.setItem('addressDetails', JSON.stringify(addressDetails));

        console.log('Selected Address:', selectedAddress, 'Normalized Address:', normalizedAddress, 'Address Details:', addressDetails);
      }
    } catch (error) {
      console.error('Error selecting address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
      debounce={500}
      searchOptions={{ types: ['establishment'] }} // Restrict to businesses
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading: placesLoading }) => (
        <div style={{ width: '100%' }}>
          {/* Input */}
          <TextField
            {...getInputProps({
              id: 'google-address-autocomplete',
              placeholder: 'Business Address',
              // label: 'Business Address',
            })}
            error={error}
            helperText={helperText}
            fullWidth
            variant="outlined"
            InputProps={{
              sx: { height: 50 },  
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Suggestions */}
          {(loading || placesLoading) && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
              <CircularProgress size={20} />
            </div>
          )}

          {suggestions.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                borderRadius: 1,
                maxHeight: 250,
                overflowY: 'auto',
              }}
            >
              <List>
                {suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.placeId}
                    {...getSuggestionItemProps(suggestion, {
                      style: {
                        backgroundColor: suggestion.active ? '#f5f5f5' : 'white',
                        cursor: 'pointer',
                      },
                    })}
                  >
                    <ListItemText primary={suggestion.description} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  );
}