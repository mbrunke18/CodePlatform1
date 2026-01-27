import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type Organization } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateOrganizationModal from "@/components/CreateOrganizationModal";

export default function OrganizationsOverview() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: organizations, isLoading } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
    queryFn: () => api.getOrganizations(),
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-purple-500 to-pink-500',
      'from-teal-500 to-blue-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Your Organizations</h3>
          <Button 
            onClick={() => setShowCreateModal(true)}
            data-testid="button-create-organization"
          >
            <i className="fas fa-plus w-4 mr-2"></i>
            New Organization
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-background p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
                <div className="h-5 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : organizations?.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-building text-muted-foreground text-3xl mb-4"></i>
            <p className="text-muted-foreground">No organizations created yet</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4"
              data-testid="button-create-first-organization"
            >
              Create Your First Organization
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations?.map((org, index) => (
              <div 
                key={org.id} 
                className="bg-background p-6 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                data-testid={`card-organization-${index}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-lg flex items-center justify-center`}>
                    <i className="fas fa-building text-white w-5"></i>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(org.status)}`}>
                      {org.status}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-base font-semibold text-foreground mb-2" data-testid={`text-org-name-${index}`}>
                  {org.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4" data-testid={`text-org-description-${index}`}>
                  {org.description || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span data-testid={`text-org-members-${index}`}>0 members</span>
                  <span data-testid={`text-org-scenarios-${index}`}>0 scenarios</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CreateOrganizationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </Card>
  );
}
