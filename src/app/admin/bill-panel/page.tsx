
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, LogOut, Receipt, Eye, Download, Car, Wrench } from "lucide-react";
import { YunexLogo } from "@/components/yunex-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImages from "@/lib/placeholder-images.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


// Types for invoices
type VehicleInvoice = {
  id: string; date: Date; total: number; branchName: string; branchCode: string; branchGstNo?: string; branchContact: string; branchAddress: string; branchCity: string; branchDistrict: string; branchState: string; branchPinCode: string; model?: string; noOfSeat?: string; chassisNo?: string; motorNo?: string; controllerNo?: string; chargerNo1?: string; chargerNo2?: string; batteryMaker?: string; batteryNo1?: string; batteryNo2?: string; batteryNo3?: string; batteryNo4?: string; batteryNo5?: string; batteryNo6?: string; quantity: number; rate: number;
};

type SparePartInvoice = {
    id: string; date: Date; total: number; partCode: string; hsnCode: string; rate: number; sourceBranchCode: string; branchName: string; branchCode: string; branchGstNo?: string; branchContact: string; branchAddress: string; branchCity: string; branchDistrict: string; branchState: string; branchPinCode: string; sparePart: string; quantity: number;
};

type Transaction = {
  id: string;
  date: Date;
  total: number;
  branchName: string;
  description: string;
  type: 'E-Vehicle' | 'Spare Part';
  rawData: VehicleInvoice | SparePartInvoice;
};

type VehicleStockItem = { sNo: number; branchCode: string; eVehicle: string; price: number; openingStock: number; sales: number; closingStock: number; date: string; };
type SparePartStockItem = { sNo: number; branchCode: string; sparePart: string; partCode?: string; hsnCode?: string; price?: number; openingStock: number; sales: number; closingStock: number; date: string; };

const initialVehicleStockData: VehicleStockItem[] = [
  { sNo: 1, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 50, sales: 5, closingStock: 45, date: '2024-07-29' },
  { sNo: 2, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 30, sales: 10, closingStock: 20, date: '2024-07-29' },
  { sNo: 3, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', price: 82000, openingStock: 40, sales: 0, closingStock: 40, date: '2024-07-29' },
  { sNo: 4, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', price: 79000, openingStock: 25, sales: 3, closingStock: 22, date: '2024-07-29' },
  { sNo: 5, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 45, sales: 2, closingStock: 43, date: '2024-07-30' },
  { sNo: 6, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 20, sales: 5, closingStock: 15, date: '2024-07-30' },
  { sNo: 7, branchCode: 'Yunex202601', eVehicle: 'Yunex-X2', price: 82000, openingStock: 40, sales: 1, closingStock: 39, date: '2024-07-30' },
  { sNo: 8, branchCode: 'Yunex202601', eVehicle: 'Yunex-X1', price: 75000, openingStock: 43, sales: 3, closingStock: 40, date: '2024-07-31' },
  { sNo: 9, branchCode: 'Yunex202602', eVehicle: 'Yunex-S1', price: 68000, openingStock: 15, sales: 0, closingStock: 15, date: '2024-07-31' },
  { sNo: 10, branchCode: 'Yunex202603', eVehicle: 'Yunex-X3', price: 79000, openingStock: 22, sales: 2, closingStock: 20, date: '2024-07-31' },
];

const initialSparePartStockData: SparePartStockItem[] = [
    { sNo: 1, branchCode: 'Yunex202601', sparePart: 'Brake Pad', partCode: 'BP-001', hsnCode: '8708', price: 550, openingStock: 200, sales: 20, closingStock: 180, date: '2024-07-30' },
    { sNo: 2, branchCode: 'Yunex202602', sparePart: 'Headlight', partCode: 'HL-001', hsnCode: '8512', price: 1200, openingStock: 100, sales: 5, closingStock: 95, date: '2024-07-30' },
    { sNo: 3, branchCode: 'Yunex202601', sparePart: 'Battery 48V', partCode: 'BT-48V', hsnCode: '8507', price: 15000, openingStock: 50, sales: 2, closingStock: 48, date: '2024-07-30' },
    { sNo: 4, branchCode: 'Yunex202603', sparePart: 'Tyre 10-inch', partCode: 'TY-10', hsnCode: '4011', price: 2500, openingStock: 150, sales: 10, closingStock: 140, date: '2024-07-30' },
];

const branches = [
  { id: '01', district: 'Deoghar', branchCode: 'Yunex202601' }, { id: '02', district: 'Dumka', branchCode: 'Yunex202602' }, { id: '03', district: 'Bokaro', branchCode: 'Yunex202603' }, { id: '04', district: 'Giridih', branchCode: 'Yunex202604' }, { id: '05', district: 'Koderma', branchCode: 'Yunex202605' }, { id: '06', district: 'Godda', branchCode: 'Yunex202606' }, { id: '07', district: 'Chatra', branchCode: 'Yunex202607' }, { id: '08', district: 'Dhanbad', branchCode: 'Yunex202608' }, { id: '09', district: 'Garhwa', branchCode: 'Yunex202609' }, { id: '10', district: 'East-Singhbhum', branchCode: 'Yunex202610' }, { id: '11', district: 'Jamtara', branchCode: 'Yunex202611' }, { id: '12', district: 'Saraikela-Kharsawan', branchCode: 'Yunex202612' }, { id: '13', district: 'Ranchi', branchCode: 'Yunex202613' }, { id: '14', district: 'Pakur', branchCode: 'Yunex202614' }, { id: '15', district: 'Latehar', branchCode: 'Yunex202615' }, { id: '16', district: 'Hazaribagh', branchCode: 'Yunex202616' }, { id: '17', district: 'Lohardaga', branchCode: 'Yunex202617' }, { id: '18', district: 'Palamu', branchCode: 'Yunex202618' }, { id: '19', district: 'Ramghar', branchCode: 'Yunex202619' }, { id: '20', district: 'Simdega', branchCode: 'Yunex202620' }, { id: '21', district: 'West-Singhbhum', branchCode: 'Yunex202621' }, { id: '22', district: 'Sahebganj', branchCode: 'Yunex202622' }, { id: '23', district: 'Gumla', branchCode: 'Yunex202623' }, { id: '24', district: 'Khunti', branchCode: 'Yunex202624' },
];

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const toWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const numStr = Math.floor(num).toString();
    const [, major] = numStr.match(/^(\d+)/) || [];
    if (!major) return '';

    const numberToWords = (n: number): string => {
        if (n < 20) return ones[n];
        const digit = n % 10;
        if (n < 100) return tens[Math.floor(n / 10)] + (digit ? ' ' + ones[digit] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + numberToWords(n % 100) : '');
        if (n < 100000) return numberToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + numberToWords(n % 1000) : '');
        if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 !== 0 ? ' ' + numberToWords(n % 100000) : '');
        return numberToWords(Math.floor(n / 10000000)) + ' crore' + (n % 10000000 !== 0 ? ' ' + numberToWords(n % 10000000) : '');
    };
    return numberToWords(parseInt(major));
};

const vehicleInvoiceSchema = z.object({
  branchName: z.string().min(1), branchCode: z.string().min(1), branchGstNo: z.string().optional(), branchContact: z.string().min(1), branchAddress: z.string().min(1), branchCity: z.string().min(1), branchDistrict: z.string().min(1), branchState: z.string().min(1), branchPinCode: z.string().min(1),
  model: z.string().min(1, "Model is required"), noOfSeat: z.string().optional(), chassisNo: z.string().optional(), motorNo: z.string().optional(), controllerNo: z.string().optional(), chargerNo1: z.string().optional(), chargerNo2: z.string().optional(), batteryMaker: z.string().optional(), batteryNo1: z.string().optional(), batteryNo2: z.string().optional(), batteryNo3: z.string().optional(), batteryNo4: z.string().optional(), batteryNo5: z.string().optional(), batteryNo6: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1), rate: z.coerce.number().min(0),
});

const sparePartInvoiceSchema = z.object({
  sourceBranchCode: z.string().min(1, "Source branch is required"),
  branchName: z.string().min(1), branchCode: z.string().min(1), branchGstNo: z.string().optional(), branchContact: z.string().min(1), branchAddress: z.string().min(1), branchCity: z.string().min(1), branchDistrict: z.string().min(1), branchState: z.string().min(1), branchPinCode: z.string().min(1),
  sparePart: z.string().min(1, "Please select a spare part."), quantity: z.coerce.number().min(1),
});

export default function BillPanelPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [allVehicleStock, setAllVehicleStock] = useState<VehicleStockItem[]>([]);
  const [allSparePartStock, setAllSparePartStock] = useState<SparePartStockItem[]>([]);

  const vehicleInvoiceFormMethods = useForm<z.infer<typeof vehicleInvoiceSchema>>({ resolver: zodResolver(vehicleInvoiceSchema), defaultValues: { quantity: 1, branchName: "", branchCode: "", branchGstNo: "", branchContact: "", branchAddress: "", branchCity: "", branchDistrict: "", branchState: "", branchPinCode: "", model: "", noOfSeat: "", chassisNo: "", motorNo: "", controllerNo: "", chargerNo1: "", chargerNo2: "", batteryMaker: "", batteryNo1: "", batteryNo2: "", batteryNo3: "", batteryNo4: "", batteryNo5: "", batteryNo6: "" } });
  const sparePartInvoiceFormMethods = useForm<z.infer<typeof sparePartInvoiceSchema>>({ resolver: zodResolver(sparePartInvoiceSchema), defaultValues: { quantity: 1 } });

  const watchedVehicleBranch = vehicleInvoiceFormMethods.watch("branchCode");
  const watchedVehicleModel = vehicleInvoiceFormMethods.watch("model");

  const watchedSparePartSourceBranch = sparePartInvoiceFormMethods.watch("sourceBranchCode");
  const watchedSparePart = sparePartInvoiceFormMethods.watch("sparePart");

  const availableVehicleModels = allVehicleStock.map(item => item.eVehicle);
  const selectedVehicleStock = allVehicleStock.find(item => item.branchCode === watchedVehicleBranch && item.eVehicle === watchedVehicleModel);

  const availableSpareParts = allSparePartStock.filter(item => item.branchCode === watchedSparePartSourceBranch && item.closingStock > 0).map(item => item.sparePart);
  const selectedSparePartStock = allSparePartStock.find(item => item.branchCode === watchedSparePartSourceBranch && item.sparePart === watchedSparePart);

  useEffect(() => {
    try {
      const storedVehicleInvoices: VehicleInvoice[] = JSON.parse(localStorage.getItem('yunex-invoices') || '[]').map((inv: any) => ({ ...inv, date: new Date(inv.date) }));
      const storedSparePartInvoices: SparePartInvoice[] = JSON.parse(localStorage.getItem('yunex-spare-part-invoices') || '[]').map((inv: any) => ({ ...inv, date: new Date(inv.date) }));
      
      const storedVehicleStock = localStorage.getItem('yunex-vehicle-stock');
      if (storedVehicleStock) {
        setAllVehicleStock(JSON.parse(storedVehicleStock));
      } else {
        localStorage.setItem('yunex-vehicle-stock', JSON.stringify(initialVehicleStockData));
        setAllVehicleStock(initialVehicleStockData);
      }

      const storedSparePartStock = localStorage.getItem('yunex-spareparts-stock');
      if (storedSparePartStock) {
        setAllSparePartStock(JSON.parse(storedSparePartStock));
      } else {
        localStorage.setItem('yunex-spareparts-stock', JSON.stringify(initialSparePartStockData));
        setAllSparePartStock(initialSparePartStockData);
      }

      const vehicleTransactions: Transaction[] = storedVehicleInvoices.map(inv => ({ id: inv.id, date: inv.date, total: inv.total, branchName: inv.branchName, description: inv.model || 'E-Vehicle', type: 'E-Vehicle', rawData: inv, }));
      const sparePartTransactions: Transaction[] = storedSparePartInvoices.map(inv => ({ id: inv.id, date: inv.date, total: inv.total, branchName: inv.branchName, description: inv.sparePart, type: 'Spare Part', rawData: inv, }));
      
      setAllTransactions([...vehicleTransactions, ...sparePartTransactions].sort((a, b) => b.date.getTime() - a.date.getTime()));
    } catch (error) {
      console.error("Failed to load invoice data from localStorage", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load invoice data." });
    }
  }, [toast]);
  
  useEffect(() => {
    if (selectedVehicleStock) {
        vehicleInvoiceFormMethods.setValue("rate", selectedVehicleStock.price);
    }
  }, [selectedVehicleStock, vehicleInvoiceFormMethods]);

  useEffect(() => {
    if (watchedVehicleBranch) {
        const b = branches.find(br => br.branchCode === watchedVehicleBranch);
        if (b) {
            vehicleInvoiceFormMethods.setValue("branchName", b.district);
            vehicleInvoiceFormMethods.setValue("branchDistrict", b.district);
            vehicleInvoiceFormMethods.setValue("branchCity", b.district);
        }
        vehicleInvoiceFormMethods.resetField("model");
    }
  }, [watchedVehicleBranch, vehicleInvoiceFormMethods]);


  const generateVehicleInvoicePDF = async (invoiceData: VehicleInvoice) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const primaryColor = '#326cd1';
    const mutedColor = '#6c757d';
    
    const logoX = 14; const logoY = 15; const logoSize = 25;
    doc.setFillColor(primaryColor); doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor('#FFFFFF'); doc.text('YU', logoX + logoSize / 2, logoY + logoSize / 2 + 4, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(primaryColor); doc.text('YUNEX', logoX + logoSize + 3, 30);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor('#000000'); doc.text('TAX INVOICE', pageWidth - 14, 25, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(mutedColor); doc.text(`Invoice No: ${invoiceData.id}`, pageWidth - 14, 32, { align: 'right' });
    doc.text(`Date: ${invoiceData.date.toLocaleDateString('en-IN')}`, pageWidth - 14, 37, { align: 'right' });
    doc.setDrawColor(200); doc.line(14, 45, pageWidth - 14, 45);

    autoTable(doc, {
        startY: 50, theme: 'plain', body: [[{ content: 'Billed To:', styles: { fontStyle: 'bold', textColor: primaryColor } }], [`Branch: ${invoiceData.branchName} (${invoiceData.branchCode})\n${invoiceData.branchAddress}, ${invoiceData.branchCity}, ${invoiceData.branchDistrict}, ${invoiceData.branchState} - ${invoiceData.branchPinCode}\nGSTIN: ${invoiceData.branchGstNo || 'N/A'}\nContact: ${invoiceData.branchContact}`]], styles: { fontSize: 9, cellPadding: 1 },
    });
    
    const tableRows: any[][] = [];
    tableRows.push(['', { content: invoiceData.model || 'Yunex - E.Bike', styles: { fontStyle: 'bold' } }, '', invoiceData.quantity.toString(), `₹${invoiceData.rate.toFixed(2)}`, `₹${invoiceData.total.toFixed(2)}`]);
    const specs = [
        { desc: 'Model', value: invoiceData.model }, { desc: 'No of seat', value: invoiceData.noOfSeat }, { desc: 'Chassis No', value: invoiceData.chassisNo }, { desc: 'Motor No', value: invoiceData.motorNo }, { desc: 'Controller No', value: invoiceData.controllerNo }, { desc: 'Charger No - 1', value: invoiceData.chargerNo1 }, { desc: 'Charger No - 2', value: invoiceData.chargerNo2 }, { desc: 'Battery Maker', value: invoiceData.batteryMaker },
        ...[1, 2, 3, 4, 5, 6].map(i => ({ desc: `Battery No-${i}`, value: (invoiceData as any)[`batteryNo${i}`] }))
    ];
    let specIndex = 1; specs.forEach((spec) => { if (spec.value) { tableRows.push([String(specIndex++), spec.desc, String(spec.value), '', '', '']); } });

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10, head: [["S. No.", "Description", "Particular", "Qty", "Rate", "Amount"]], body: tableRows, theme: 'grid', headStyles: { fillColor: [50, 108, 209], textColor: [255, 255, 255], fontStyle: 'bold' }, columnStyles: { 0: { halign: 'center', cellWidth: 15 }, 2: { cellWidth: 'auto' }, 3: { halign: 'right', cellWidth: 20 }, 4: { halign: 'right', cellWidth: 30 }, 5: { halign: 'right', cellWidth: 30 } },
    });
    
    let finalY = (doc as any).lastAutoTable.finalY;
    const totalInWords = toWords(invoiceData.total).trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Only';
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('Total In Words:', 14, finalY + 10); doc.setFont('helvetica', 'normal'); doc.text(totalInWords, 14, finalY + 15, { maxWidth: pageWidth / 2 });
    autoTable(doc, { startY: finalY + 5, body: [['Total Invoice Value', `₹${invoiceData.total.toFixed(2)}`]], theme: 'plain', tableWidth: 80, margin: { left: pageWidth - 80 - 14 }, styles: { halign: 'right' }, bodyStyles: { fontStyle: 'bold', fontSize: 12, cellPadding: { top: 5, right: 0 } } });
    finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY > pageHeight - 70 ? pageHeight - 60 : finalY + 30;
    const footerY = pageHeight - 20; doc.setDrawColor(220); doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    doc.setFontSize(8); doc.setTextColor(mutedColor); doc.text(`Office address: Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004.`, 14, footerY); doc.text(`www.yunex.com | E-mail: info@yunex.com`, 14, footerY + 4);
    doc.setFontSize(10); doc.setTextColor('#000000'); doc.text('For YUNEX', pageWidth - 14, signatureY, { align: 'right' }); doc.text('Authorised Signatory', pageWidth - 14, signatureY + 20, { align: 'right' });

    return doc;
  };

  const generateSparePartInvoicePDF = async (invoiceData: SparePartInvoice) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const primaryColor = '#326cd1'; const mutedColor = '#6c757d';
    
    const logoX = 14; const logoY = 15; const logoSize = 25;
    doc.setFillColor(primaryColor); doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor('#FFFFFF'); doc.text('YU', logoX + logoSize / 2, logoY + logoSize / 2 + 4, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(primaryColor); doc.text('YUNEX', logoX + logoSize + 3, 30);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor('#000000'); doc.text('TAX INVOICE', pageWidth - 14, 25, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(mutedColor); doc.text(`Invoice No: ${invoiceData.id}`, pageWidth - 14, 32, { align: 'right' });
    doc.text(`Date: ${invoiceData.date.toLocaleDateString('en-IN')}`, pageWidth - 14, 37, { align: 'right' });
    doc.setDrawColor(200); doc.line(14, 45, pageWidth - 14, 45);

    const sellerBranch = branches.find(b => b.branchCode === invoiceData.sourceBranchCode);
    const sellerDetails = `YUNEX - ${sellerBranch?.district || invoiceData.sourceBranchCode}\nNear D.C. Office, Satyam Nagar\nDhanbad, Jharkhand, INDIA. 826004.\nE-mail: info@yunex.com`;
    const buyerDetails = `Branch: ${invoiceData.branchName} (${invoiceData.branchCode})\n${invoiceData.branchAddress}, ${invoiceData.branchCity}, ${invoiceData.branchDistrict}, ${invoiceData.branchState} - ${invoiceData.branchPinCode}\nGSTIN: ${invoiceData.branchGstNo || 'N/A'}\nContact: ${invoiceData.branchContact}`;
    autoTable(doc, { startY: 50, theme: 'plain', body: [[{ content: 'Billed By:', styles: { fontStyle: 'bold', textColor: primaryColor } }, { content: 'Billed To:', styles: { fontStyle: 'bold', textColor: primaryColor } }], [sellerDetails, buyerDetails]], styles: { fontSize: 9, cellPadding: {top: 1, right: 2, bottom: 1, left: 0}, valign: 'top' }, });
    autoTable(doc, { startY: (doc as any).lastAutoTable.finalY + 10, head: [['S.No.', 'Spare Part', 'Part Code', 'HSN Code', 'Qty', 'Rate', 'Amount']], body: [['1', invoiceData.sparePart, invoiceData.partCode, invoiceData.hsnCode, invoiceData.quantity, `₹${invoiceData.rate.toFixed(2)}`, `₹${invoiceData.total.toFixed(2)}`]], theme: 'grid', headStyles: { fillColor: [50, 108, 209], textColor: [255, 255, 255], fontStyle: 'bold' }, columnStyles: { 0: { halign: 'center' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' } }, });
    let finalY = (doc as any).lastAutoTable.finalY;
    const totalInWords = toWords(invoiceData.total).trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Only';
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('Total In Words:', 14, finalY + 10); doc.setFont('helvetica', 'normal'); doc.text(totalInWords, 14, finalY + 15, { maxWidth: pageWidth / 2 });
    autoTable(doc, { startY: finalY + 5, body: [['Total Invoice Value', `₹${invoiceData.total.toFixed(2)}`]], theme: 'plain', tableWidth: 80, margin: { left: pageWidth - 80 - 14 }, styles: { halign: 'right' }, bodyStyles: { fontStyle: 'bold', fontSize: 12, cellPadding: { top: 5, right: 0 } }, });
    finalY = (doc as any).lastAutoTable.finalY;
    let signatureY = finalY > pageHeight - 70 ? pageHeight - 60 : finalY + 30;
    const footerY = pageHeight - 20; doc.setDrawColor(220); doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    doc.setFontSize(8); doc.setTextColor(mutedColor); doc.text(`Office address: Near D.C. Office, Satyam Nagar, Dhanbad, Jharkhand, INDIA. 826004.`, 14, footerY); doc.text(`www.yunex.com | E-mail: info@yunex.com`, 14, footerY + 4);
    doc.setFontSize(10); doc.setTextColor('#000000'); doc.text('For YUNEX', pageWidth - 14, signatureY, { align: 'right' }); doc.text('Authorised Signatory', pageWidth - 14, signatureY + 20, { align: 'right' });
    
    return doc;
  };

  const handleVehicleInvoiceSubmit = (data: z.infer<typeof vehicleInvoiceSchema>) => {
    const latestEntry = allVehicleStock
      .filter(item => item.branchCode === data.branchCode && item.eVehicle.toLowerCase() === (data.model || '').toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!latestEntry || latestEntry.closingStock < data.quantity) {
      toast({ variant: "destructive", title: "Out of Stock", description: `Not enough stock for ${data.model} at branch ${data.branchCode}.` });
      return;
    }

    const newInvoice: VehicleInvoice = { ...data, id: `YUNEX-V-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date(), total: data.quantity * data.rate };
    const newTransaction: Transaction = { id: newInvoice.id, date: newInvoice.date, total: newInvoice.total, branchName: newInvoice.branchName, description: newInvoice.model || 'E-Vehicle', type: 'E-Vehicle', rawData: newInvoice };

    const newStockEntry: VehicleStockItem = {
        sNo: allVehicleStock.length > 0 ? Math.max(...allVehicleStock.map(item => item.sNo)) + 1 : 1,
        branchCode: data.branchCode, eVehicle: data.model || 'Unknown Model', price: data.rate,
        openingStock: latestEntry.closingStock, sales: data.quantity, closingStock: latestEntry.closingStock - data.quantity, date: new Date().toISOString().split('T')[0],
    };

    const updatedStock = [newStockEntry, ...allVehicleStock];
    const currentInvoices = JSON.parse(localStorage.getItem('yunex-invoices') || '[]');
    const updatedInvoices = [newInvoice, ...currentInvoices];

    localStorage.setItem('yunex-vehicle-stock', JSON.stringify(updatedStock));
    localStorage.setItem('yunex-invoices', JSON.stringify(updatedInvoices));
    setAllVehicleStock(updatedStock);
    setAllTransactions(prev => [newTransaction, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));

    toast({ title: "Invoice Generated & Stock Updated", description: `Invoice ${newInvoice.id} created for ${data.branchName}. Branch stock has been updated.` });
    vehicleInvoiceFormMethods.reset({ quantity: 1, branchName: "", branchCode: "", branchGstNo: "", branchContact: "", branchAddress: "", branchCity: "", branchDistrict: "", branchState: "", branchPinCode: "", model: "", noOfSeat: "", chassisNo: "", motorNo: "", controllerNo: "", chargerNo1: "", chargerNo2: "", batteryMaker: "", batteryNo1: "", batteryNo2: "", batteryNo3: "", batteryNo4: "", batteryNo5: "", batteryNo6: "" });
  };

  const handleSparePartInvoiceSubmit = (data: z.infer<typeof sparePartInvoiceSchema>) => {
    const latestEntry = allSparePartStock
      .filter(item => item.branchCode === data.sourceBranchCode && item.sparePart.toLowerCase() === data.sparePart.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!latestEntry || !latestEntry.price || latestEntry.closingStock < data.quantity) {
      toast({ variant: "destructive", title: "Out of Stock", description: "Not enough stock available for this sale." });
      return;
    }
    
    const rate = latestEntry.price;
    const total = data.quantity * rate;
    const newInvoice: SparePartInvoice = { ...data, id: `YUNEX-SP-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date(), total, rate, partCode: latestEntry.partCode || 'N/A', hsnCode: latestEntry.hsnCode || 'N/A' };
    const newTransaction: Transaction = { id: newInvoice.id, date: newInvoice.date, total: newInvoice.total, branchName: newInvoice.branchName, description: newInvoice.sparePart, type: 'Spare Part', rawData: newInvoice };

    const newStockEntry: SparePartStockItem = {
      sNo: allSparePartStock.length > 0 ? Math.max(...allSparePartStock.map(item => item.sNo)) + 1 : 1,
      branchCode: data.sourceBranchCode, sparePart: data.sparePart, partCode: latestEntry.partCode, hsnCode: latestEntry.hsnCode, price: latestEntry.price,
      openingStock: latestEntry.closingStock, sales: data.quantity, closingStock: latestEntry.closingStock - data.quantity, date: new Date().toISOString().split('T')[0],
    };

    const updatedStock = [newStockEntry, ...allSparePartStock];
    const currentInvoices = JSON.parse(localStorage.getItem('yunex-spare-part-invoices') || '[]');
    const updatedInvoices = [newInvoice, ...currentInvoices];

    localStorage.setItem('yunex-spareparts-stock', JSON.stringify(updatedStock));
    localStorage.setItem('yunex-spare-part-invoices', JSON.stringify(updatedInvoices));
    setAllSparePartStock(updatedStock);
    setAllTransactions(prev => [newTransaction, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));

    toast({ title: "Invoice Generated", description: "Stock has been updated." });
    sparePartInvoiceFormMethods.reset({ quantity: 1 });
  };


  const handleAction = async (action: 'view' | 'download', transaction: Transaction) => {
    try {
      const doc = transaction.type === 'E-Vehicle'
        ? await generateVehicleInvoicePDF(transaction.rawData as VehicleInvoice)
        : await generateSparePartInvoicePDF(transaction.rawData as SparePartInvoice);
      
      if (action === 'view') {
        window.open(doc.output('bloburl'), '_blank');
      } else {
        doc.save(`invoice-${transaction.id}.pdf`);
        toast({ title: "Success", description: "PDF downloaded successfully." });
      }
    } catch(e) {
        console.error("PDF Generation Error:", e);
        toast({ variant: "destructive", title: "Error", description: `Failed to generate PDF for ${action}.` });
    }
  };
  
  const renderTable = (transactions: Transaction[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.id}</TableCell>
              <TableCell>{t.date.toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`flex items-center gap-2 ${t.type === 'E-Vehicle' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {t.type === 'E-Vehicle' ? <Car className="h-4 w-4" /> : <Wrench className="h-4 w-4" />} {t.type}
                </span>
              </TableCell>
              <TableCell>{t.branchName}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell className="text-right">₹{t.total.toFixed(2)}</TableCell>
              <TableCell className="flex justify-center items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleAction('view', t)}><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleAction('download', t)}><Download className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow><TableCell colSpan={7} className="text-center">No transactions found.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex min-h-screen w-full flex-col relative bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-8 bg-[#326cd1]">
        <div className="flex items-center gap-2">
          <YunexLogo className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary-foreground font-headline">YUNEX - Admin</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Avatar><AvatarImage src={placeholderImages.placeholderImages[0].imageUrl} alt="Admin avatar" data-ai-hint={placeholderImages.placeholderImages[0].imageHint} /><AvatarFallback>A</AvatarFallback></Avatar>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} aria-label="Log Out"><LogOut className="h-5 w-5 text-muted-foreground" /></Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Bill Panel</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Receipt className="h-6 w-6" />Bill Management</CardTitle>
            <CardDescription>View, manage, and generate all company invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="e-vehicle">E. Vehicle Invoices</TabsTrigger>
                <TabsTrigger value="spare-part">Spare Parts Invoices</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>All Invoice Transactions</CardTitle></CardHeader>
                  <CardContent>{renderTable(allTransactions)}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="e-vehicle" className="mt-4 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Generate E. Vehicle Invoice</CardTitle><CardDescription>Create a new sales invoice for an E-Vehicle.</CardDescription></CardHeader>
                  <CardContent>
                    <FormProvider {...vehicleInvoiceFormMethods}>
                      <form onSubmit={vehicleInvoiceFormMethods.handleSubmit(handleVehicleInvoiceSubmit)} className="space-y-6">
                         <h3 className="text-lg font-medium">Branch Details</h3><Separator />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <FormField control={vehicleInvoiceFormMethods.control} name="branchCode" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a branch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.branchCode}>{branch.district} ({branch.branchCode})</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                           )} />
                            <FormItem>
                             <FormLabel>Branch Code</FormLabel>
                             <FormControl><Input value={watchedVehicleBranch || ''} disabled /></FormControl>
                           </FormItem>
                           <FormField control={vehicleInvoiceFormMethods.control} name="branchGstNo" render={({ field }) => (<FormItem><FormLabel>GST No.</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={vehicleInvoiceFormMethods.control} name="branchContact" render={({ field }) => (<FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={vehicleInvoiceFormMethods.control} name="branchAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} />
                         </div>
                         <h3 className="text-lg font-medium pt-4">Vehicle & Billing</h3><Separator />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField control={vehicleInvoiceFormMethods.control} name="model" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Model</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedVehicleBranch}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select vehicle model" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[...new Set(availableVehicleModels)].map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                             <FormField control={vehicleInvoiceFormMethods.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={vehicleInvoiceFormMethods.control} name="rate" render={({ field }) => (<FormItem><FormLabel>Rate</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                            <FormField control={vehicleInvoiceFormMethods.control} name="noOfSeat" render={({ field }) => (<FormItem><FormLabel>No of Seat</FormLabel><FormControl><Input placeholder="e.g., 2" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="chassisNo" render={({ field }) => (<FormItem><FormLabel>Chassis No.</FormLabel><FormControl><Input placeholder="Enter chassis number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="motorNo" render={({ field }) => (<FormItem><FormLabel>Motor No.</FormLabel><FormControl><Input placeholder="Enter motor number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="controllerNo" render={({ field }) => (<FormItem><FormLabel>Controller No.</FormLabel><FormControl><Input placeholder="Enter controller number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="chargerNo1" render={({ field }) => (<FormItem><FormLabel>Charger No - 1</FormLabel><FormControl><Input placeholder="Enter charger 1 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="chargerNo2" render={({ field }) => (<FormItem><FormLabel>Charger No - 2</FormLabel><FormControl><Input placeholder="Enter charger 2 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryMaker" render={({ field }) => (<FormItem><FormLabel>Battery Maker</FormLabel><FormControl><Input placeholder="Enter battery maker" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo1" render={({ field }) => (<FormItem><FormLabel>Battery No-1</FormLabel><FormControl><Input placeholder="Enter battery 1 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo2" render={({ field }) => (<FormItem><FormLabel>Battery No-2</FormLabel><FormControl><Input placeholder="Enter battery 2 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo3" render={({ field }) => (<FormItem><FormLabel>Battery No-3</FormLabel><FormControl><Input placeholder="Enter battery 3 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo4" render={({ field }) => (<FormItem><FormLabel>Battery No-4</FormLabel><FormControl><Input placeholder="Enter battery 4 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo5" render={({ field }) => (<FormItem><FormLabel>Battery No-5</FormLabel><FormControl><Input placeholder="Enter battery 5 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={vehicleInvoiceFormMethods.control} name="batteryNo6" render={({ field }) => (<FormItem className="lg:col-span-4"><FormLabel>Battery No-6</FormLabel><FormControl><Input placeholder="Enter battery 6 number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                         </div>
                         <Button type="submit" className="w-full md:w-auto">Generate E. Vehicle Invoice</Button>
                      </form>
                    </FormProvider>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>E. Vehicle Invoice History</CardTitle></CardHeader>
                  <CardContent>{renderTable(allTransactions.filter(t => t.type === 'E-Vehicle'))}</CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="spare-part" className="mt-4 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Generate Spare Part Invoice</CardTitle><CardDescription>Create a new sales invoice for a spare part.</CardDescription></CardHeader>
                  <CardContent>
                    <FormProvider {...sparePartInvoiceFormMethods}>
                      <form onSubmit={sparePartInvoiceFormMethods.handleSubmit(handleSparePartInvoiceSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={sparePartInvoiceFormMethods.control} name="sourceBranchCode" render={({ field }) => (<FormItem><FormLabel>Source Branch (Billed By)</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select source branch" /></SelectTrigger></FormControl><SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.branchCode}>{b.district}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                          <FormField control={sparePartInvoiceFormMethods.control} name="branchCode" render={({ field }) => (<FormItem><FormLabel>Destination Branch (Billed To)</FormLabel><Select onValueChange={(value) => { field.onChange(value); const b = branches.find(br => br.branchCode === value); if(b) { sparePartInvoiceFormMethods.setValue("branchName", b.district); sparePartInvoiceFormMethods.setValue("branchDistrict", b.district); sparePartInvoiceFormMethods.setValue("branchCity", b.district); } }} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select destination branch" /></SelectTrigger></FormControl><SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.branchCode}>{b.district}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>
                         <h3 className="text-lg font-medium pt-4">Part & Billing</h3><Separator />
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={sparePartInvoiceFormMethods.control} name="sparePart" render={({ field }) => (<FormItem><FormLabel>Spare Part</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedSparePartSourceBranch}><FormControl><SelectTrigger><SelectValue placeholder="Select spare part" /></SelectTrigger></FormControl><SelectContent>{[...new Set(availableSpareParts)].map(part => <SelectItem key={part} value={part}>{part}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={sparePartInvoiceFormMethods.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                            <div><FormLabel>Rate</FormLabel><Input value={selectedSparePartStock?.price ? `₹${selectedSparePartStock.price.toFixed(2)}` : 'N/A'} disabled /></div>
                         </div>
                         <Button type="submit" className="w-full md:w-auto">Generate Spare Part Invoice</Button>
                      </form>
                    </FormProvider>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Spare Parts Invoice History</CardTitle></CardHeader>
                  <CardContent>{renderTable(allTransactions.filter(t => t.type === 'Spare Part'))}</CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
