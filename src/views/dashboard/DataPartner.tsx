const [analytics, setAnalytics] = useState({ totalUsers: 0, totalAgents: 0 })
  const [loading, setLoading] = useState(true)
  const [earning, setTotalEarning] = useState(0)
  const [commissionChartData, setCommissionChartData] = useState([])
  const [currency,setCurrency]=useState()

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
      setTotalEarning(result?.totalEarnings)
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
