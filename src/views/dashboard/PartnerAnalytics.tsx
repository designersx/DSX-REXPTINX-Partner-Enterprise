"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function AnalyticsSection() {
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalAgents: 0 })
  const [loading, setLoading] = useState(true)
  const [earning, setEarning] = useState(0)
  const [commissionChartData, setCommissionChartData] = useState([])
  const [currency, setCurrency] = useState()

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const referralCode = typeof window !== "undefined" ? localStorage.getItem("referralCode") : null

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        if (!referralCode) throw new Error("Referral Code not found in local storage.")

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneranalytics/${referralCode}`
        )

        const data = response.data
        setAnalytics({
          totalUsers: data.totalUsers || 0,
          totalAgents: data.totalAgents || 0,
        })
      } catch (err: any) {
        console.error("Error fetching analytics:", err)
        Swal.fire("Error", err.message || "Something went wrong", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [referralCode])

  const getReferralUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`
      )
      const result = await res.json()

      if (result?.status === true) {
        setEarning(result?.totalEarnings)
        setCurrency(result?.commissions[0]?.currency)
        const monthlyTotals: Record<string, number> = {}
        result.commissions.forEach((entry: any) => {
          const key = entry.commissionMonth
          const amount = parseFloat(entry.commissionAmount || 0)
          monthlyTotals[key] = (monthlyTotals[key] || 0) + amount
        })

        const today = new Date()
        const currentYear = today.getFullYear()

        const months: { name: string; amount: number }[] = []
        for (let m = 0; m < 12; m++) {
          const date = new Date(currentYear, m, 1) // Corrected day to 1
          const monthKey = `${currentYear}-${String(m + 1).padStart(2, "0")}`
          const label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })

          months.push({
            name: label,
            amount: parseFloat((monthlyTotals[monthKey] || 0).toFixed(2)),
          })
        }

        setCommissionChartData(months)
      }
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) getReferralUsers()
  }, [userId])

  function formatCurrency(amount: any, currency?: string) {
    const numAmount = Number(amount); // convert to number

    if (isNaN(numAmount)) return ""; // avoid showing "NaN" or error

    if (!currency || currency === "undefined" || currency === "null") {
      return numAmount.toFixed(2); // e.g. "0.00"
    }

    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(numAmount);
    } catch (e) {
      return numAmount.toFixed(2); // fallback
    }
  }

  return (
    <Box sx={{ p: 3, spaceY: 3, animation: 'fadeIn 0.5s' }}>
      <Box sx={{ animation: 'slideInFromLeft 0.7s' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Overview of your platform&apos;s key metrics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loading analytics...
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderLeft: '4px solid #A855F7', transition: 'all 0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                      Total Referred Users
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {analytics.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ borderLeft: '4px solid #3B82F6', transition: 'all 0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                      Total Agents from Referred Users
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {analytics.totalAgents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card sx={{ borderLeft: '4px solid #10B981', transition: 'all 0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                <CardHeader
                  title={
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                      Total Earnings from Referred Users
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    {formatCurrency(earning ?? 0, currency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Chart Section */}
      <Card sx={{ borderLeft: '4px solid #A855F7', mx: 1, mt: 3, mb: 1 }}>
        <CardHeader
          title={
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
              Monthly Commission Overview
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' }}>
              <CircularProgress size={30} sx={{ color: '#6524EB' }} />
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: 256 }}>
              <ResponsiveContainer width="95%" height="100%">
                <LineChart data={commissionChartData}>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodColor="#6524EB"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`${currency ? `${currency} ` : '$'}${value.toFixed(2)}`, 'Amount']} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6524EB"
                    strokeWidth={2}
                    dot={false}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}