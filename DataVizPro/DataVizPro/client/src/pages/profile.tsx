import { useState } from "react";
import { User, Phone, Mail, MapPin, Settings, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Алексей",
    lastName: "Иванов",
    username: "alexivanov",
    phone: "+998901234567",
    email: "alex.ivanov@example.com",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Профиль обновлен",
      description: "Ваш профиль успешно обновлен",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values in a real app
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
        <div className="restaurant-gradient p-6 rounded-xl shadow-restaurant">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <User className="mr-3 h-8 w-8" />
                Профиль
              </h1>
              <p className="text-white/90 text-sm mt-1">Tashkent Restaurant</p>
            </div>
            <div className="text-4xl">👤</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Profile Avatar */}
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-12 w-12 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-600">@{profile.username}</p>
          </div>

          {/* Personal Information */}
          <div className="restaurant-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Личная информация</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Отмена" : "Редактировать"}
                </Button>
              </div>
              <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Имя</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile(prev => ({ ...prev, firstName: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Фамилия</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile(prev => ({ ...prev, lastName: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">Имя пользователя</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile(prev => ({ ...prev, username: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Номер телефона</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile(prev => ({ ...prev, phone: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile(prev => ({ ...prev, email: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 restaurant-button-primary">
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Отмена
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Имя</p>
                      <p className="text-gray-900">{profile.firstName} {profile.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Телефон</p>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>
          </div>

          {/* Delivery Addresses */}
          <div className="restaurant-card">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Адреса доставки</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Дом</p>
                    <p className="text-sm text-gray-600">ул. Амира Темура, 15, кв. 25, Ташкент</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Изменить
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  Добавить новый адрес
                </Button>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="restaurant-card">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Настройки</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-5 w-5" />
                  Настройки приложения
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Phone className="mr-3 h-5 w-5" />
                  Уведомления
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="mr-3 h-5 w-5" />
                  Конфиденциальность
                </Button>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="restaurant-card">
            <div className="p-4">
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-3 h-5 w-5" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}