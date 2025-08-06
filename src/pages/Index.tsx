import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeForm, setActiveForm] = useState<'ks2' | 'ks3' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleExportExcel = () => {
    // Имитация экспорта в Excel
    alert('Документ экспортирован в Excel! 📊');
  };

  const resetForm = () => {
    setActiveForm(null);
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Icon name="FileText" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Документы ГОСТ</h1>
                <p className="text-sm text-slate-600">Создание КС-2 и КС-3</p>
              </div>
            </div>
            {activeForm && (
              <Button variant="outline" onClick={resetForm}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!activeForm ? (
          // Главная страница - выбор типа документа
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Создание документов КС-2 и КС-3
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Автоматическое создание справок о стоимости выполненных работ и 
                актов о приемке выполненных работ по ГОСТ
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20" 
                    onClick={() => setActiveForm('ks2')}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Icon name="FileBarChart" size={32} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">КС-2</CardTitle>
                      <CardDescription>Справка о стоимости выполненных работ</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Автозаполнение по ГОСТ
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Импорт данных из смет
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Экспорт в Excel
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20"
                    onClick={() => setActiveForm('ks3')}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg group-hover:bg-primary/10 transition-colors">
                      <Icon name="ClipboardCheck" size={32} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">КС-3</CardTitle>
                      <CardDescription>Акт о приемке выполненных работ</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Соответствие нормативам
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Интеграция с КС-2
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Быстрое оформление
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Дополнительные возможности */}
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Upload" size={24} className="text-primary" />
                  Загрузка смет
                </CardTitle>
                <CardDescription>
                  Автоматический парсинг видов услуг, цен и данных из файлов смет
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="FileSpreadsheet" size={16} />
                    Excel (.xlsx, .xls)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="File" size={16} />
                    CSV файлы
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="FileText" size={16} />
                    Текстовые форматы
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Форма создания документа
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeForm === 'ks2' ? (
                    <>
                      <Icon name="FileBarChart" size={24} className="text-primary" />
                      Создание КС-2: Справка о стоимости выполненных работ
                    </>
                  ) : (
                    <>
                      <Icon name="ClipboardCheck" size={24} className="text-primary" />
                      Создание КС-3: Акт о приемке выполненных работ
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Ручной ввод</TabsTrigger>
                    <TabsTrigger value="upload">Загрузка сметы</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="object-name">Наименование объекта</Label>
                          <Input id="object-name" placeholder="Введите наименование объекта" />
                        </div>
                        
                        <div>
                          <Label htmlFor="contract-number">Номер договора</Label>
                          <Input id="contract-number" placeholder="№ договора" />
                        </div>
                        
                        <div>
                          <Label htmlFor="contractor">Подрядчик</Label>
                          <Input id="contractor" placeholder="ООО 'Строительная компания'" />
                        </div>
                        
                        <div>
                          <Label htmlFor="customer">Заказчик</Label>
                          <Input id="customer" placeholder="Наименование заказчика" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="period">Отчетный период</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите период" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="january">Январь 2024</SelectItem>
                              <SelectItem value="february">Февраль 2024</SelectItem>
                              <SelectItem value="march">Март 2024</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="total-amount">Общая стоимость (руб.)</Label>
                          <Input id="total-amount" type="number" placeholder="0.00" />
                        </div>
                        
                        <div>
                          <Label htmlFor="vat">НДС (%)</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите НДС" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Без НДС</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Место выполнения работ</Label>
                          <Input id="location" placeholder="Адрес объекта" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="work-description">Описание выполненных работ</Label>
                      <Textarea 
                        id="work-description" 
                        placeholder="Подробное описание видов работ, объемов, технических характеристик..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".xlsx,.xls,.csv,.txt"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-primary/10 p-4 rounded-full">
                            <Icon name="Upload" size={32} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-slate-700">
                              Загрузите файл сметы
                            </p>
                            <p className="text-sm text-slate-500">
                              Поддерживаются форматы: Excel, CSV, TXT
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    {uploadedFile && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Icon name="FileCheck" size={20} className="text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Файл загружен</p>
                            <p className="text-sm text-green-600">{uploadedFile.name}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={resetForm}>
                    Отменить
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="secondary">
                      <Icon name="Eye" size={16} className="mr-2" />
                      Предварительный просмотр
                    </Button>
                    <Button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;