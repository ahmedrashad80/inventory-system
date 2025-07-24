import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}api/products`);
      return response.data;
    },
  });

  const addProduct = useMutation({
    mutationFn: (newProduct) => {
      return axios.post(`${API_URL}api/products`, newProduct, {
        headers:
          newProduct instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => {
      return axios.put(`${API_URL}api/products/${id}`, data, {
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}api/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
