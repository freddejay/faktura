import React, { useEffect, useState } from "react";
import { Plus, Trash2, Download, FileText } from "lucide-react";

export default function InvoiceGenerator() {
  const defaultInvoice = {
    invoiceNumber: "2401",
    invoiceDate: "2026-01-15",
    dueDate: "2026-02-14",
    customerName: "Nordisk Handel AB",
    customerAddress: "Storgatan 45 B",
    customerPostal: "11422 STOCKHOLM",
    customerCountry: "Sverige",
    customerNumber: "1042",
    customerReference: "Anna Bergström",
    yourReference: "Erik Andersson",
    paymentTerms: "30 dagar",
    interestRate: "8%",
    companyName: "Teknik Konsult Sverige AB",
    companyAddress: "c/o Erik Andersson, Vasagatan 12",
    companyPostal: "11520 STOCKHOLM",
    companyCountry: "Sverige",
    companyPhone: "070-1234567",
    companyEmail: "info@teknikkonsult.se",
    companyBankgiro: "5234-8876",
    companyOrgNumber: "556789-1234",
    companyVatNumber: "SE556789123401",
    iban: "SE45 5000 0000 0583 9825 7466",
    bic: "ESSESESS",
    items: [
      {
        description: "Konsulttjänster webbutveckling januari 2026",
        quantity: 120,
        price: 950,
      },
    ],
  };

  const [invoice, setInvoice] = useState(() => {
    const savedInvoice = localStorage.getItem("invoiceData");
    return savedInvoice ? JSON.parse(savedInvoice) : defaultInvoice;
  });

  // Save to localStorage whenever invoice data changes
  useEffect(() => {
    localStorage.setItem("invoiceData", JSON.stringify(invoice));
  }, [invoice]);

  const [showPreview, setShowPreview] = useState(true);

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 0, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setInvoice({
      ...invoice,
      items: invoice.items.filter((_: any, i: number) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice({ ...invoice, items: newItems });
  };

  const updateInvoice = (field: string, value: string) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + item.quantity * item.price,
      0,
    );
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.25;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .invoice-preview {
          font-family: 'Inter', Arial, sans-serif;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }
        
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body * {
            visibility: hidden;
          }
          .invoice-preview, .invoice-preview * {
            visibility: visible;
          }
          .invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            box-shadow: none;
            padding: 15mm;
            display: flex;
            flex-direction: column;
          }
          .invoice-content {
            flex: 1;
          }
          .invoice-footer {
            margin-top: auto;
            padding-top: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .table-row {
          transition: all 0.2s ease;
        }
        
        .table-row:hover {
          background-color: rgba(59, 130, 246, 0.03);
        }
        
        .form-input {
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .btn-primary {
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-primary:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="no-print mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="w-10 h-10 text-blue-600" />
              Faktura
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-primary px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 flex items-center gap-2 lg:hidden"
            >
              {showPreview ? "Visa Formulär" : "Visa Förhandsgranskning"}
            </button>
            <button
              onClick={printInvoice}
              className="btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Skriv ut / Spara PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div
            className={`no-print ${showPreview ? "hidden lg:block" : "block"}`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {/* Company Info */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Företagsinformation
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Företagsnamn
                    </label>
                    <input
                      type="text"
                      value={invoice.companyName}
                      onChange={(e) =>
                        updateInvoice("companyName", e.target.value)
                      }
                      placeholder="Företagsnamn"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Adress
                    </label>
                    <input
                      type="text"
                      value={invoice.companyAddress}
                      onChange={(e) =>
                        updateInvoice("companyAddress", e.target.value)
                      }
                      placeholder="Adress"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Postnummer och Ort
                    </label>
                    <input
                      type="text"
                      value={invoice.companyPostal}
                      onChange={(e) =>
                        updateInvoice("companyPostal", e.target.value)
                      }
                      placeholder="Postnummer och Ort"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="text"
                        value={invoice.companyPhone}
                        onChange={(e) =>
                          updateInvoice("companyPhone", e.target.value)
                        }
                        placeholder="Telefon"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        E-post
                      </label>
                      <input
                        type="email"
                        value={invoice.companyEmail}
                        onChange={(e) =>
                          updateInvoice("companyEmail", e.target.value)
                        }
                        placeholder="E-post"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Bankgiro
                      </label>
                      <input
                        type="text"
                        value={invoice.companyBankgiro}
                        onChange={(e) =>
                          updateInvoice("companyBankgiro", e.target.value)
                        }
                        placeholder="Bankgiro"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Organisationsnr
                      </label>
                      <input
                        type="text"
                        value={invoice.companyOrgNumber}
                        onChange={(e) =>
                          updateInvoice("companyOrgNumber", e.target.value)
                        }
                        placeholder="Organisationsnr"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Momsreg. nr
                    </label>
                    <input
                      type="text"
                      value={invoice.companyVatNumber}
                      onChange={(e) =>
                        updateInvoice("companyVatNumber", e.target.value)
                      }
                      placeholder="Momsreg. nr"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={invoice.iban}
                        onChange={(e) => updateInvoice("iban", e.target.value)}
                        placeholder="IBAN"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        BIC
                      </label>
                      <input
                        type="text"
                        value={invoice.bic}
                        onChange={(e) => updateInvoice("bic", e.target.value)}
                        placeholder="BIC"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Fakturauppgifter
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fakturanummer
                      </label>
                      <input
                        type="text"
                        value={invoice.invoiceNumber}
                        onChange={(e) =>
                          updateInvoice("invoiceNumber", e.target.value)
                        }
                        placeholder="Fakturanummer"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fakturadatum
                      </label>
                      <input
                        type="date"
                        value={invoice.invoiceDate}
                        onChange={(e) =>
                          updateInvoice("invoiceDate", e.target.value)
                        }
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Betalningsvillkor
                      </label>
                      <input
                        type="text"
                        value={invoice.paymentTerms}
                        onChange={(e) =>
                          updateInvoice("paymentTerms", e.target.value)
                        }
                        placeholder="Betalningsvillkor"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Förfallodatum
                      </label>
                      <input
                        type="date"
                        value={invoice.dueDate}
                        onChange={(e) =>
                          updateInvoice("dueDate", e.target.value)
                        }
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dröjsmålsränta
                    </label>
                    <input
                      type="text"
                      value={invoice.interestRate}
                      onChange={(e) =>
                        updateInvoice("interestRate", e.target.value)
                      }
                      placeholder="Dröjsmålsränta"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Vår referens
                      </label>
                      <input
                        type="text"
                        value={invoice.yourReference}
                        onChange={(e) =>
                          updateInvoice("yourReference", e.target.value)
                        }
                        placeholder="Vår referens"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Er referens
                      </label>
                      <input
                        type="text"
                        value={invoice.customerReference}
                        onChange={(e) =>
                          updateInvoice("customerReference", e.target.value)
                        }
                        placeholder="Er referens"
                        className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Kundinformation
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kundnamn
                    </label>
                    <input
                      type="text"
                      value={invoice.customerName}
                      onChange={(e) =>
                        updateInvoice("customerName", e.target.value)
                      }
                      placeholder="Kundnamn"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Adress
                    </label>
                    <input
                      type="text"
                      value={invoice.customerAddress}
                      onChange={(e) =>
                        updateInvoice("customerAddress", e.target.value)
                      }
                      placeholder="Adress"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Postnummer och Ort
                    </label>
                    <input
                      type="text"
                      value={invoice.customerPostal}
                      onChange={(e) =>
                        updateInvoice("customerPostal", e.target.value)
                      }
                      placeholder="Postnummer och Ort"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Land
                    </label>
                    <input
                      type="text"
                      value={invoice.customerCountry}
                      onChange={(e) =>
                        updateInvoice("customerCountry", e.target.value)
                      }
                      placeholder="Land"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kundnr
                    </label>
                    <input
                      type="text"
                      value={invoice.customerNumber}
                      onChange={(e) =>
                        updateInvoice("customerNumber", e.target.value)
                      }
                      placeholder="Kundnr"
                      className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Fakturarader
                  </h2>
                  <button
                    onClick={addItem}
                    className="btn-primary px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Lägg till rad
                  </button>
                </div>
                <div className="space-y-3">
                  {invoice.items.map(
                    (
                      item: {
                        description:
                          | string
                          | number
                          | readonly string[]
                          | undefined;
                        quantity:
                          | string
                          | number
                          | readonly string[]
                          | undefined;
                        price: string | number | readonly string[] | undefined;
                      },
                      index: number,
                    ) => (
                      <div
                        key={index}
                        className="bg-slate-50 p-4 rounded-lg space-y-3"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Beskrivning
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            placeholder="Beskrivning"
                            className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Antal
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "quantity",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              placeholder="Antal"
                              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              À-pris
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "price",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              placeholder="À-pris"
                              className="form-input w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Ta bort
                            </label>
                            <button
                              onClick={() => removeItem(index)}
                              className="btn-primary w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className={showPreview ? "block" : "hidden lg:block"}>
            <div className="invoice-preview rounded-lg p-12 max-w-4xl mx-auto">
              <div className="invoice-content">
                {/* Header */}
                <div className="border-b-2 border-slate-300 pb-6 mb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800">
                        {invoice.companyName}
                      </h1>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">
                        Faktura
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Customer Info */}
                  <div>
                    <div className="mb-6">
                      <div className="font-semibold text-slate-800 mb-2">
                        {invoice.customerName}
                      </div>
                      <div className="text-sm text-slate-600">
                        {invoice.customerAddress}
                      </div>
                      <div className="text-sm text-slate-600">
                        {invoice.customerPostal}
                      </div>
                      <div className="text-sm text-slate-600">
                        {invoice.customerCountry}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex">
                        <span className="w-32 text-slate-600">Kundnr</span>
                        <span className="text-slate-800">
                          {invoice.customerNumber}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-slate-600">Er referens</span>
                        <span className="text-slate-800">
                          {invoice.customerReference}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 text-slate-600">
                          Vår referens
                        </span>
                        <span className="text-slate-800">
                          {invoice.yourReference}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Invoice Details */}
                  <div className="text-sm space-y-1">
                    <div className="flex">
                      <span className="w-40 text-slate-600">Fakturadatum</span>
                      <span className="text-slate-800">
                        {invoice.invoiceDate}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-slate-600">Fakturanr</span>
                      <span className="text-slate-800">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-slate-600">
                        Betalningsvillkor
                      </span>
                      <span className="text-slate-800">
                        {invoice.paymentTerms}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-slate-600">Förfallodatum</span>
                      <span className="text-slate-800">{invoice.dueDate}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-slate-600">
                        Dröjsmålsränta
                      </span>
                      <span className="text-slate-800">
                        {invoice.interestRate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full text-sm">
                    <thead className="border-b-2 border-slate-300">
                      <tr>
                        <th className="text-left py-2 text-slate-800 font-semibold">
                          Benämning
                        </th>
                        <th className="text-right py-2 text-slate-800 font-semibold w-20">
                          Antal
                        </th>
                        <th className="text-right py-2 text-slate-800 font-semibold w-24">
                          À-pris
                        </th>
                        <th className="text-right py-2 text-slate-800 font-semibold w-32">
                          Summa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map(
                        (
                          item: {
                            description: string;
                            quantity: number;
                            price: number;
                          },
                          index: number,
                        ) => (
                          <tr
                            key={index}
                            className="table-row border-b border-slate-200"
                          >
                            <td className="py-3 text-slate-800">
                              {item.description}
                            </td>
                            <td className="py-3 text-right text-slate-800">
                              {formatNumber(item.quantity)}
                            </td>
                            <td className="py-3 text-right text-slate-800">
                              {formatNumber(item.price)}
                            </td>
                            <td className="py-3 text-right text-slate-800 font-medium">
                              {formatNumber(item.quantity * item.price)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className=" rounded text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exkl. moms</span>
                      <span className="text-slate-800 font-medium">
                        {formatNumber(calculateSubtotal())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Moms</span>
                      <span className="text-slate-800 font-medium">
                        {formatNumber(calculateVAT())}
                      </span>
                    </div>
                    <div className="flex justify-between border-t-2 border-slate-300 pt-2">
                      <span className="text-slate-800 font-bold">Totalt</span>
                      <span className="text-slate-800 font-bold">
                        {formatNumber(calculateTotal())}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-2xl font-bold text-slate-800 mb-1">
                      ATT BETALA
                    </div>
                    <div className="text-3xl font-bold text-slate-800">
                      {formatNumber(calculateTotal())}
                    </div>
                  </div>
                </div>

                <div className="text-sm space-y-1 mb-8">
                  <div className="flex">
                    <span className="w-32 text-slate-600">Moms 25%</span>
                    <span className="text-slate-800">
                      {formatNumber(calculateVAT())} (
                      {formatNumber(calculateSubtotal())})
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-600">IBAN</span>
                    <span className="text-slate-800 font-mono">
                      {invoice.iban}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-600">BIC</span>
                    <span className="text-slate-800 font-mono">
                      {invoice.bic}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="invoice-footer border-t-2 border-slate-300 pt-6">
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 mb-2">
                      Adress
                    </div>
                    <div className="text-slate-600">{invoice.companyName}</div>
                    <div className="text-slate-600">
                      {invoice.companyAddress}
                    </div>
                    <div className="text-slate-600">
                      {invoice.companyPostal}
                    </div>
                    <div className="text-slate-600">
                      {invoice.companyCountry}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-2">
                      Telefon
                    </div>
                    <div className="text-slate-600">{invoice.companyPhone}</div>
                    <div className="font-semibold text-slate-800 mb-2 mt-3">
                      E-post
                    </div>
                    <div className="text-slate-600">{invoice.companyEmail}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-2">
                      Bankgiro
                    </div>
                    <div className="text-slate-600">
                      {invoice.companyBankgiro}
                    </div>
                    <div className="font-semibold text-slate-800 mb-2 mt-3">
                      Organisationsnr
                    </div>
                    <div className="text-slate-600">
                      {invoice.companyOrgNumber}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 mb-2">
                      Momsreg. nr
                    </div>
                    <div className="text-slate-600">
                      {invoice.companyVatNumber}
                    </div>
                    <div className="font-semibold text-slate-800 mb-2 mt-3">
                      Godkänd för F-skatt
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
