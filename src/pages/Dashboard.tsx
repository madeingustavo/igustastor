
import React from 'react';
import Layout from '../components/Layout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { DashboardTabs } from '../components/dashboard/DashboardTabs';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader />
        <StatsOverview />
        <DashboardTabs />
      </div>
    </Layout>
  );
};

export default Dashboard;
