
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deviceService, DeviceFilter } from "../services/device.service";
import { Device } from "../types/schema";

export const useDevicesAPI = () => {
  const queryClient = useQueryClient();

  // Get devices list with filters
  const useDevicesList = (filters: DeviceFilter = {}) => {
    return useQuery({
      queryKey: ['devices', filters],
      queryFn: () => deviceService.getDevices(filters),
    });
  };

  // Get available devices list
  const useAvailableDevices = (filters: DeviceFilter = {}) => {
    return useQuery({
      queryKey: ['available-devices', filters],
      queryFn: () => deviceService.getAvailableDevices(filters),
    });
  };

  // Get a single device by ID
  const useDeviceById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['device', id],
      queryFn: () => deviceService.getDeviceById(id as string),
      enabled: !!id, // Only run the query if id exists
    });
  };

  // Get device stats
  const useDeviceStats = () => {
    return useQuery({
      queryKey: ['device-stats'],
      queryFn: () => deviceService.getDeviceStats(),
    });
  };

  // Create a new device
  const useCreateDevice = () => {
    return useMutation({
      mutationFn: (deviceData: Partial<Device>) => deviceService.createDevice(deviceData),
      onSuccess: () => {
        // Invalidate devices queries to refetch
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        queryClient.invalidateQueries({ queryKey: ['available-devices'] });
        queryClient.invalidateQueries({ queryKey: ['device-stats'] });
      },
    });
  };

  // Update an existing device
  const useUpdateDevice = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<Device> }) => 
        deviceService.updateDevice(id, data),
      onSuccess: (_, variables) => {
        // Invalidate specific device and lists
        queryClient.invalidateQueries({ queryKey: ['device', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        queryClient.invalidateQueries({ queryKey: ['available-devices'] });
        queryClient.invalidateQueries({ queryKey: ['device-stats'] });
      },
    });
  };

  // Delete a device
  const useDeleteDevice = () => {
    return useMutation({
      mutationFn: (id: string) => deviceService.deleteDevice(id),
      onSuccess: () => {
        // Invalidate devices queries to refetch
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        queryClient.invalidateQueries({ queryKey: ['available-devices'] });
        queryClient.invalidateQueries({ queryKey: ['device-stats'] });
      },
    });
  };

  // Import devices
  const useImportDevices = () => {
    return useMutation({
      mutationFn: (payload: { file: File, onProgress?: (percentage: number) => void }) => 
        deviceService.importDevices(payload.file, payload.onProgress),
      onSuccess: () => {
        // Invalidate devices queries to refetch
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        queryClient.invalidateQueries({ queryKey: ['available-devices'] });
        queryClient.invalidateQueries({ queryKey: ['device-stats'] });
      },
    });
  };

  return {
    useDevicesList,
    useAvailableDevices,
    useDeviceById,
    useDeviceStats,
    useCreateDevice,
    useUpdateDevice,
    useDeleteDevice,
    useImportDevices,
  };
};
