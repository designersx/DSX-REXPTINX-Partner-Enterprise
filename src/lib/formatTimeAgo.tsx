export  const   formatTimeAgo = (dateString) => {
  if (!dateString) return "N/A";

  const createdAt = new Date(dateString);
  const now = new Date();
  const diffInMs = now - createdAt;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // For older dates, show exact date
  return createdAt.toLocaleDateString(); 
};