'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/data';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function InventoryReportsPage() {
  const { products } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'stock'>('name');

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'stock') {
      filtered.sort((a, b) => a.stock - b.stock);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  const getStockStatus = (stock: number) => {
    if (stock >= 20) {
      return { label: 'Aman', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
    } else if (stock >= 10) {
      return { label: 'Menipis', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: AlertTriangle };
    } else {
      return { label: 'Habis', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertCircle };
    }
  };

  const stats = useMemo(() => {
    const safe = filteredProducts.filter((p) => p.stock >= 20).length;
    const low = filteredProducts.filter((p) => p.stock >= 10 && p.stock < 20).length;
    const critical = filteredProducts.filter((p) => p.stock < 10).length;

    return { safe, low, critical };
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Laporan Stok Produk</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Stok Aman</p>
              <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Stok Menipis</p>
              <p className="text-2xl font-bold text-orange-600">{stats.low}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Stok Habis</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Kategori
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Kategori</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Urutkan Berdasarkan
            </label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'stock')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama Produk</SelectItem>
                <SelectItem value="stock">Stok (Terendah ke Tertinggi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSelectedCategory('');
                setSortBy('name');
              }}
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 bg-card border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Nama Produk
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Kategori
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Stok Tersedia
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock);
                const Icon = status.icon;

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-border hover:bg-background ${
                      product.stock < 10 ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className={`py-3 px-2 font-semibold ${
                      product.stock < 10 ? 'text-destructive' : 'text-foreground'
                    }`}>
                      {product.name}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      {product.stock} unit
                    </td>
                    <td className="py-3 px-2">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                        <Icon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada produk yang ditemukan
          </div>
        )}
      </Card>
    </div>
  );
}
