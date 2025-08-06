import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface WorkItem {
  id: number;
  smetaNumber: string;
  name: string;
  edNumber: string;
  units: string;
  quantity: string;
  price: string;
  totalPrice: string;
}

const Index = () => {
  const [activeForm, setActiveForm] = useState<'ks2' | 'ks3' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    { id: 1, smetaNumber: '', name: '', edNumber: '', units: '', quantity: '', price: '', totalPrice: '' }
  ]);
  const [formData, setFormData] = useState({
    actNumber: '',
    docDate: '06.08.2025',
    ndsRate: '20',
    ndsType: '1', // 1-не учитывать, 2-в сумме, 3-сверху
    printForm: '350'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const calculateTotals = () => {
    let total = 0;
    let ndsTotal = 0;
    
    workItems.forEach(item => {
      const itemTotal = parseFloat(item.totalPrice) || 0;
      total += itemTotal;
      
      if (formData.ndsType !== '1') {
        const ndsRate = parseFloat(formData.ndsRate) / 100;
        if (formData.ndsType === '2') {
          // НДС в сумме
          ndsTotal += itemTotal * ndsRate / (1 + ndsRate);
        } else if (formData.ndsType === '3') {
          // НДС сверху
          ndsTotal += itemTotal * ndsRate;
        }
      }
    });
    
    return { total, ndsTotal };
  };

  const addWorkItem = () => {
    const newId = Math.max(...workItems.map(item => item.id), 0) + 1;
    setWorkItems([...workItems, {
      id: newId,
      smetaNumber: '',
      name: '',
      edNumber: '',
      units: '',
      quantity: '',
      price: '',
      totalPrice: ''
    }]);
  };

  const deleteWorkItem = (id: number) => {
    if (workItems.length > 1) {
      setWorkItems(workItems.filter(item => item.id !== id));
    }
  };

  const updateWorkItem = (id: number, field: keyof WorkItem, value: string) => {
    setWorkItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Автоматический расчет стоимости
          if (field === 'quantity' || field === 'price') {
            const quantity = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
            const price = parseFloat(field === 'price' ? value : item.price) || 0;
            updatedItem.totalPrice = (quantity * price).toFixed(2);
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleExportExcel = () => {
    alert('Документ КС-2 экспортирован в Excel! 📊');
  };

  const resetForm = () => {
    setActiveForm(null);
    setUploadedFile(null);
    setWorkItems([{ id: 1, smetaNumber: '', name: '', edNumber: '', units: '', quantity: '', price: '', totalPrice: '' }]);
  };

  const { total, ndsTotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                Назад к выбору
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
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

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-105" 
                    onClick={() => setActiveForm('ks2')}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Icon name="FileBarChart" size={32} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">КС-2</CardTitle>
                      <CardDescription>Справка о стоимости выполненных работ</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Полное соответствие ГОСТ
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Автоматический расчет НДС
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Экспорт в Excel и PDF
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-105"
                    onClick={() => setActiveForm('ks3')}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Icon name="ClipboardCheck" size={32} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">КС-3</CardTitle>
                      <CardDescription>Акт о приемке выполненных работ</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Связь с документом КС-2
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Автоматическое заполнение
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Готовые шаблоны подписей
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
          // Форма КС-2
          <div className="space-y-6">
            {/* Шапка документа */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileBarChart" size={24} className="text-primary" />
                  Акт о приемке выполненных работ КС-2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="actNumber">КС-2 №</Label>
                    <Input 
                      id="actNumber" 
                      value={formData.actNumber}
                      onChange={(e) => setFormData({...formData, actNumber: e.target.value})}
                      placeholder="Номер документа" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="docDate">от</Label>
                    <Input 
                      id="docDate" 
                      type="date"
                      value="2025-08-06"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="printForm">Печатная форма</Label>
                    <Select value={formData.printForm} onValueChange={(value) => setFormData({...formData, printForm: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="350">КС-2 #1 (с заголовками)</SelectItem>
                        <SelectItem value="351">КС-2 #2 (без заголовков)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Подрядчик */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Подрядчик (субподрядчик)</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="заполнить по ИНН" className="text-sm" />
                    <Button variant="outline" size="sm">
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Наименование</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Адрес</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Телефоны</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">ОКПО</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Должность</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Сдал (Ф.И.О.)</Label>
                    <Input className="h-8" />
                  </div>
                </CardContent>
              </Card>

              {/* Заказчик */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Заказчик (генподрядчик)</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="заполнить по ИНН" className="text-sm" />
                    <Button variant="outline" size="sm">
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Наименование</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Адрес</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Телефоны</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">ОКПО</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Должность</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Принял (Ф.И.О.)</Label>
                    <Input className="h-8" />
                  </div>
                </CardContent>
              </Card>

              {/* Инвестор */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Инвестор</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="заполнить по ИНН" className="text-sm" />
                    <Button variant="outline" size="sm">
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Наименование</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Адрес</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Телефоны</Label>
                    <Input className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">ОКПО</Label>
                    <Input className="h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Информация о документе */}
            <Card>
              <CardHeader>
                <CardTitle>Информация о документе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Наименование стройки</Label>
                      <Textarea rows={2} />
                    </div>
                    <div>
                      <Label>Адрес стройки</Label>
                      <Textarea rows={2} />
                    </div>
                    <div>
                      <Label>Наименование объекта</Label>
                      <Textarea rows={2} />
                    </div>
                    <div>
                      <Label>Вид деятельности по ОКДП</Label>
                      <Input />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Номер договора подряда</Label>
                        <Input />
                      </div>
                      <div>
                        <Label>Дата договора</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Сметная стоимость по договору</Label>
                      <Input placeholder="0.00" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Отчетный период с</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Отчетный период по</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Ставка НДС</Label>
                      <div className="space-y-2">
                        <Select value={formData.ndsRate} onValueChange={(value) => setFormData({...formData, ndsRate: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">без НДС</SelectItem>
                            <SelectItem value="3">0%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="ndsType" 
                              value="1" 
                              checked={formData.ndsType === '1'}
                              onChange={(e) => setFormData({...formData, ndsType: e.target.value})}
                            />
                            не учитывать
                          </label>
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="ndsType" 
                              value="2"
                              checked={formData.ndsType === '2'}
                              onChange={(e) => setFormData({...formData, ndsType: e.target.value})}
                            />
                            в сумме
                          </label>
                          <label className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name="ndsType" 
                              value="3"
                              checked={formData.ndsType === '3'}
                              onChange={(e) => setFormData({...formData, ndsType: e.target.value})}
                            />
                            сверху
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Таблица работ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Выполненные работы
                  <Button onClick={addWorkItem} size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить строку
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-2 py-2 text-xs">№ по смете</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Наименование работ</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">№ ед. расц.</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Ед.</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Кол-во</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Цена</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Стоимость</th>
                        <th className="border border-slate-300 px-2 py-2 text-xs">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workItems.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0"
                              value={item.smetaNumber}
                              onChange={(e) => updateWorkItem(item.id, 'smetaNumber', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Textarea 
                              className="min-h-8 text-xs border-0 resize-none"
                              rows={2}
                              value={item.name}
                              onChange={(e) => updateWorkItem(item.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0"
                              value={item.edNumber}
                              onChange={(e) => updateWorkItem(item.id, 'edNumber', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0"
                              value={item.units}
                              onChange={(e) => updateWorkItem(item.id, 'units', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0"
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateWorkItem(item.id, 'quantity', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0"
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateWorkItem(item.id, 'price', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1">
                            <Input 
                              className="h-8 text-xs border-0 bg-slate-50"
                              value={item.totalPrice}
                              readOnly
                            />
                          </td>
                          <td className="border border-slate-300 px-1 py-1 text-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteWorkItem(item.id)}
                              disabled={workItems.length <= 1}
                            >
                              <Icon name="Trash2" size={14} className="text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-medium">
                        <td colSpan={5} className="border border-slate-300 px-2 py-2 text-right">НДС:</td>
                        <td className="border border-slate-300 px-2 py-2 text-center">{ndsTotal.toFixed(2)} р.</td>
                        <td className="border border-slate-300 px-2 py-2 text-right font-bold">Итого:</td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-bold">{total.toFixed(2)} р.</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={addWorkItem}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить строку
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    for(let i = 0; i < 10; i++) addWorkItem();
                  }}>
                    Добавить 10 строк
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Экспорт */}
            <Card>
              <CardHeader>
                <CardTitle>Настройки вывода документа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Select defaultValue="pdf">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF (Portable Document Format)</SelectItem>
                        <SelectItem value="xlsx">XLSX (Microsoft Office)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary">
                      <Icon name="Eye" size={16} className="mr-2" />
                      Предварительный просмотр
                    </Button>
                    <Button>
                      <Icon name="Printer" size={16} className="mr-2" />
                      Печать
                    </Button>
                    <Button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать
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