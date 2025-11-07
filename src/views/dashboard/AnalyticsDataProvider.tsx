'use client'
import axios from "axios";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalUsers: number;
  totalAgents: number;
  totalEarning: number;
  commissionChartData: { name: string; amount: number }[];
  userChartData: { name: string; amount: number }[];
  agentChartData: { name: string; amount: number }[];
  currency: string;
}

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalAgents: 0,
    totalEarning: 0,
    commissionChartData: [],
    userChartData: [],
    agentChartData: [],
    currency: '',
  });
  const [loading, setLoading] = useState(true);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const referralCode = typeof window !== "undefined" ? localStorage.getItem("referralCode") : null;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        let analytics = { totalUsers: 0, totalAgents: 0, userChartData: [], agentChartData: [] };
        let earning = 0;
        let currency = '';
        let commissionChartData: any[] = [];

        if (referralCode) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneranalytics2/${referralCode}`);
          analytics = res.data;
        }

        if (userId) {
          const comRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`);
          const comResult = await comRes.json();
          if (comResult?.status === true) {
            earning = comResult.totalEarnings || 0;
            currency = comResult.commissions[0]?.currency || '';

            const monthlyTotals: Record<string, number> = {};
            comResult.commissions.forEach((entry: any) => {
              const key = entry.commissionMonth;
              const amount = parseFloat(entry.commissionAmount || 0);
              monthlyTotals[key] = (monthlyTotals[key] || 0) + amount;
            });

            const today = new Date();
            const currentYear = today.getFullYear();
            const months: { name: string; amount: number }[] = [];
            for (let m = 0; m < 12; m++) {
              const date = new Date(currentYear, m, 1);
              const monthKey = `${currentYear}-${String(m + 1).padStart(2, "0")}`;
              const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
              months.push({
                name: label,
                amount: parseFloat((monthlyTotals[monthKey] || 0).toFixed(2)),
              });
            }
            commissionChartData = months;
          }
        }

        setData({
          totalUsers: analytics.totalUsers || 0,
          totalAgents: analytics.totalAgents || 0,
          totalEarning: earning,
          commissionChartData,
          userChartData: analytics.userChartData || [],
          agentChartData: analytics.agentChartData || [],
          currency,
        });
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        Swal.fire("Error", err.message || "Failed to load analytics", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [referralCode, userId]);

  return { ...data, loading };
}