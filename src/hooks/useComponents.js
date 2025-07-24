import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useComponents = () => {
  const queryClient = useQueryClient();

  const { data: components, isLoading } = useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}api/components`);
      return response.data;
    },
  });

  const addComponent = useMutation({
    mutationFn: (formData) => {
      return axios.post(`${API_URL}api/components`, formData, {
        headers:
          formData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["components"]),
  });

  const updateComponent = useMutation({
    mutationFn: ({ id, data }) => {
      return axios.put(`${API_URL}api/components/${id}`, data, {
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["components"]),
  });

  const deleteComponent = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}api/components/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["components"]),
  });

  const stockIn = useMutation({
    mutationFn: ({ id, data }) =>
      axios.post(`${API_URL}api/components/${id}/stock-in`, data),
    onSettled: async () => {
      await queryClient.invalidateQueries(["components"]);
    },
  });

  const adjustStock = useMutation({
    mutationFn: ({ id, data }) =>
      axios.post(`${API_URL}api/components/${id}/adjust`, data),
    onSuccess: () => queryClient.invalidateQueries(["components"]),
  });

  return {
    components,
    isLoading,
    addComponent,
    updateComponent,
    deleteComponent,
    stockIn,
    adjustStock,
  };
};
