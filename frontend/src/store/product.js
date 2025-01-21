import {create} from "zustand";
import { deleteProduct } from "../../../backend/controllers/product.controller";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({products}),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.Description || !newProduct.Category) {
            return { success: false, message: 'All fields are required' };
        }
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();
            if (data.success) {
                set((state) => ({ 
                    products: Array.isArray(state.products) 
                        ? [...state.products, data.data] 
                        : [data.data] 
                }));
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.log('Error creating product:', error);
            return { success: false, message: error.message };
        }
    },
    
    getProducts: async (search = '', categories = []) => {
        try {
            let url = '/api/products';
            const params = new URLSearchParams();
            
            if (search) params.append('search', search);
            if (categories?.length > 0) params.append('categories', categories.join(','));
            
            const queryString = params.toString();
            url += queryString ? `?${queryString}` : '';
            
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                set({ products: Array.isArray(data.data) ? data.data : [] });
            }
        } catch (error) {
            console.log('Error getting products:', error);
            set({ products: [] });
        }
    },

    deleteProduct: async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!data.success) {
                alert(data.message);
                return { success: false };
            }
            set((state) => ({
                products: state.products.filter((product) => product._id !== id),
            }));
            return { success: true };
        } catch (error) {
            console.log('Error deleting product:', error);
            return { success: false };
        }
    }
}))

    
