'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useWeb3 } from '@/hooks/useWeb3';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Схема для валидации формы профиля
const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Имя пользователя должно содержать минимум 3 символа' })
    .max(30, { message: 'Имя пользователя не должно превышать 30 символов' }),
  email: z
    .string()
    .email({ message: 'Пожалуйста, введите корректный email' })
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, { message: 'Биография не должна превышать 500 символов' })
    .optional(),
});

// Схема для валидации формы уведомлений
const notificationsFormSchema = z.object({
  gameInvites: z.boolean().default(true),
  gameUpdates: z.boolean().default(true),
  marketplaceAlerts: z.boolean().default(false),
  newsletter: z.boolean().default(false),
});

export default function SettingsPage() {
  const { isConnected } = useWeb3();

  // Инициализация форм
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: 'Игрок123',
      email: '',
      bio: '',
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      gameInvites: true,
      gameUpdates: true,
      marketplaceAlerts: false,
      newsletter: false,
    },
  });

  // Обработчики отправки форм
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast.success('Профиль обновлен');
    console.log(data);
  };

  const onNotificationsSubmit = (data: z.infer<typeof notificationsFormSchema>) => {
    toast.success('Настройки уведомлений сохранены');
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Настройки</h1>
        <p className="text-muted-foreground">
          Управляйте аккаунтом и настройками уведомлений
        </p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>
                Управляйте информацией о своём профиле
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите имя пользователя" {...field} />
                        </FormControl>
                        <FormDescription>
                          Это ваше публичное имя в игре
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Используется только для уведомлений (необязательно)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Биография</FormLabel>
                        <FormControl>
                          <Input placeholder="Расскажите о себе..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={!isConnected}>
                    Сохранить
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>
                Настройте предпочтения уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
                  <FormField
                    control={notificationsForm.control}
                    name="gameInvites"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Приглашения в игру</FormLabel>
                          <FormDescription>
                            Уведомления о приглашениях в игровые сессии
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="gameUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Обновления игры</FormLabel>
                          <FormDescription>
                            Уведомления об обновлениях в текущих играх
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="marketplaceAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Оповещения маркетплейса</FormLabel>
                          <FormDescription>
                            Уведомления о торговых предложениях и NFT
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Рассылка</FormLabel>
                          <FormDescription>
                            Получайте новости и обновления проекта
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={!isConnected}>
                    Сохранить настройки
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
