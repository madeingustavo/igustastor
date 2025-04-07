
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button asChild className="bg-blue-600 hover:bg-blue-700">
        <Link to="/devices/add">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Dispositivo
        </Link>
      </Button>
    </div>
  );
};
