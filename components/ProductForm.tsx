'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { useForm, Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';
import { convertBase64 } from '@/lib/file';
import { z } from 'zod';
import { useCookies } from "next-client-cookies";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useWallet } from "@solana/wallet-adapter-react";

const formSchema = z.object({
  active: z.boolean(),
  currency: z.enum(['eurc', 'usdc']),
  description: z.string().min(1, { message: 'Description is required' }),
  image: z.preprocess(async (val) => {
    if (val instanceof File) {
      return await convertBase64(val);
    }
    return val;
  }, z.string().optional()),
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.preprocess((val) => parseFloat(val as string), z.number().positive({ message: 'Price must be positive' })),
  user: z.string()
});

type FormValues = z.infer<typeof formSchema>;

const currencyOptions = [
  { value: 'eurc', label: 'EURC', image: '/eurc.svg' },
  { value: 'usdc', label: 'USDC', image: '/usdc.svg' },
];

export default function ProductForm() {
  const cookies = useCookies();
  if (!cookies.get('token')) return <div>You are not authorized to view this page.</div>;
  
  const { publicKey } = useWallet();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: true,
      currency: 'usdc',
      description: '',
      name: '',
      price: 0,
      user: ''
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!publicKey) return

      data.user = publicKey.toBase58()
      const response = await fetch('http://localhost:3000/api/product/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        toast({
          title: 'Product saved',
          description: 'Your product details have been saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'An error occurred while saving the product details. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the product details. Please try again.',
      });
    }
  };

  return (
    <Card className="w-full mt-28 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>Define the details for your product here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea id="description" placeholder="Enter product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-3 gap-4 items-start">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="price">Price</FormLabel>
                    <FormControl>
                      <Input id="price" type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="currency">Currency</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency">
                            <div className="flex items-center">
                              {currencyOptions.find(option => option.value === field.value)?.image && (
                                <img
                                  src={currencyOptions.find(option => option.value === field.value)?.image}
                                  alt={currencyOptions.find(option => option.value === field.value)?.label}
                                  className="inline-block w-4 h-4 mr-2"
                                />
                              )}
                              {currencyOptions.find(option => option.value === field.value)?.label}
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.filter(option => option.value !== field.value).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.image && (
                                <img src={option.image} alt={option.label} className="inline-block w-4 h-4 mr-2" />
                              )}
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex flex-col items-center">
                <Label htmlFor="active">Public</Label>
                <Controller
                  name="active"
                  control={form.control}
                  render={({ field }) => (
                    <Switch id="active" aria-label="Active Status" checked={field.value} onCheckedChange={field.onChange} className="mt-2" />
                  )}
                />
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
