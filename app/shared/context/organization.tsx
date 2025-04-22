import { useNavigate } from '@remix-run/react';
import { axios } from '@shared/lib/axios';
import { useSession } from '@shared/lib/session';
import type { Organization, SuccessBackendResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrganizationContextType {
	organizations: Organization[];
	currentOrganization: Organization | null;
	setCurrentOrganization: (org: Organization) => void;
	isLoading: boolean;
	isError: boolean;
	refetchOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function OrganizationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { token } = useSession();
	const navigate = useNavigate();
	const [currentOrganization, setCurrentOrganization] =
		useState<Organization | null>(null);

	const {
		data: organizations = [],
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['organizations', token],
		queryFn: async () => {
			const response = await axios.get<
				SuccessBackendResponse<Organization[]>
			>('/organizations', {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			return response.data.data;
		},
		enabled: !!token,
		retry: false,
	});

	useEffect(() => {
		if (isError) {
			navigate('/organization/new');
		}
	}, [isError, navigate]);

	useEffect(() => {
		if (organizations.length > 0 && !currentOrganization) {
			setCurrentOrganization(organizations[0]);
		}
	}, [organizations, currentOrganization]);

	const refetchOrganizations = async () => {
		await refetch();
	};

	const value = {
		organizations,
		currentOrganization,
		setCurrentOrganization,
		isLoading,
		isError,
		refetchOrganizations,
	};

	return (
		<OrganizationContext.Provider value={value}>
			{children}
		</OrganizationContext.Provider>
	);
}

export function useOrganization() {
	const context = useContext(OrganizationContext);

	if (!context) {
		throw new Error(
			'useOrganization must be used within an OrganizationProvider',
		);
	}

	return context;
}
