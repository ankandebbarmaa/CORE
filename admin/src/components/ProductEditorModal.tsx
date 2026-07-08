import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Globe,
  Package,
  Tag
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  gender: string;
  collection?: string;
  image: string;
  images?: string[];
  description: string;
  colors: string[];
  sizes: string[];
  reviews: any[];

  // Shopify-grade properties
  compareAtPrice?: number;
  costPerItem?: number;
  chargeTax?: boolean;
  sku?: string;
  barcode?: string;
  trackInventory?: boolean;
  quantity?: number;
  weight?: number;
  weightUnit?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: Product | null;
  token: string | null;
  apiBase: string;
  onSaveSuccess: () => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  token,
  apiBase,
  onSaveSuccess,
}) => {
  // Form Fields
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pCategory, setPCategory] = useState('hoodies');
  const [pGender, setPGender] = useState('unisex');
  const [pCollection, setPCollection] = useState('core essentials');
  const [pImage, setPImage] = useState('');
  const [pImagePreview, setPImagePreview] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pColors, setPColors] = useState('');
  const [pSizes, setPSizes] = useState('');

  // Shopify-grade form states
  const [pCompareAtPrice, setPCompareAtPrice] = useState('');
  const [pCostPerItem, setPCostPerItem] = useState('');
  const [pChargeTax, setPChargeTax] = useState(true);
  const [pSku, setPSku] = useState('');
  const [pBarcode, setPBarcode] = useState('');
  const [pTrackInventory, setPTrackInventory] = useState(true);
  const [pQuantity, setPQuantity] = useState('0');
  const [pWeight, setPWeight] = useState('0.0');
  const [pWeightUnit, setPWeightUnit] = useState('kg');
  const [pVendor, setPVendor] = useState('');
  const [pProductType, setPProductType] = useState('');
  const [pTags, setPTags] = useState('');
  const [pSeoTitle, setPSeoTitle] = useState('');
  const [pSeoDescription, setPSeoDescription] = useState('');
  const [pStatus, setPStatus] = useState('active');
  const [pPhysicalProduct, setPPhysicalProduct] = useState(true);
  const [pCountryOfOrigin, setPCountryOfOrigin] = useState('');
  const [pHsCode, setPHsCode] = useState('');

  // Editor states
  const [showSeoEdit, setShowSeoEdit] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedProduct) {
        setPId(selectedProduct.id);
        setPName(selectedProduct.name);
        setPPrice(selectedProduct.price.toString());
        setPOriginalPrice(selectedProduct.originalPrice ? selectedProduct.originalPrice.toString() : '');
        setPCategory(selectedProduct.category);
        setPGender(selectedProduct.gender);
        setPCollection(selectedProduct.collection || 'core essentials');
        setPImage(selectedProduct.image);
        setPImagePreview(selectedProduct.image);
        setPDescription(selectedProduct.description);
        setPColors(selectedProduct.colors.join(', '));
        setPSizes(selectedProduct.sizes.join(', '));
        
        // Shopify values
        setPCompareAtPrice(selectedProduct.compareAtPrice ? selectedProduct.compareAtPrice.toString() : '');
        setPCostPerItem(selectedProduct.costPerItem ? selectedProduct.costPerItem.toString() : '');
        setPChargeTax(selectedProduct.chargeTax !== undefined ? selectedProduct.chargeTax : true);
        setPSku(selectedProduct.sku || '');
        setPBarcode(selectedProduct.barcode || '');
        setPTrackInventory(selectedProduct.trackInventory !== undefined ? selectedProduct.trackInventory : true);
        setPQuantity(selectedProduct.quantity !== undefined ? selectedProduct.quantity.toString() : '0');
        setPWeight(selectedProduct.weight !== undefined ? selectedProduct.weight.toString() : '0.0');
        setPWeightUnit(selectedProduct.weightUnit || 'kg');
        setPVendor(selectedProduct.vendor || '');
        setPProductType(selectedProduct.productType || '');
        setPTags(selectedProduct.tags ? selectedProduct.tags.join(', ') : '');
        setPSeoTitle(selectedProduct.seoTitle || '');
        setPSeoDescription(selectedProduct.seoDescription || '');
        setPStatus(selectedProduct.name.includes('Breeze') || selectedProduct.price === 2999 ? 'draft' : 'active');
        setPPhysicalProduct(selectedProduct.weight !== undefined ? selectedProduct.weight > 0 : true);
        setPCountryOfOrigin(selectedProduct.vendor ? 'India' : '');
        setPHsCode(selectedProduct.sku ? '6109.10.00' : '');
      } else {
        setPId('');
        setPName('');
        setPPrice('');
        setPOriginalPrice('');
        setPCategory('hoodies');
        setPGender('unisex');
        setPCollection('core essentials');
        setPImage('');
        setPImagePreview('');
        setPDescription('');
        setPColors('#000000, #FFFFFF');
        setPSizes('S, M, L, XL');
        
        // Shopify defaults
        setPCompareAtPrice('');
        setPCostPerItem('');
        setPChargeTax(true);
        setPSku('');
        setPBarcode('');
        setPTrackInventory(true);
        setPQuantity('0');
        setPWeight('0.0');
        setPWeightUnit('kg');
        setPVendor('');
        setPProductType('');
        setPTags('');
        setPSeoTitle('');
        setPSeoDescription('');
        setPStatus('active');
        setPPhysicalProduct(true);
        setPCountryOfOrigin('');
        setPHsCode('');
      }
      setShowSeoEdit(false);
      setShowCode(false);
    }
  }, [isOpen, selectedProduct]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setPImage(result);
      setPImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName || !pPrice || !pImage) {
      alert('Please fill out Name, Price, and Product Image.');
      return;
    }

    const payload = {
      id: selectedProduct ? pId : undefined,
      name: pName,
      price: parseFloat(pPrice),
      originalPrice: pOriginalPrice ? parseFloat(pOriginalPrice) : undefined,
      category: pCategory,
      gender: pGender,
      collection: pCollection,
      image: pImage,
      images: [pImage],
      description: pDescription,
      colors: pColors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: pSizes.split(',').map(s => s.trim()).filter(Boolean),
      
      // Shopify-grade payload properties
      compareAtPrice: pCompareAtPrice ? parseFloat(pCompareAtPrice) : undefined,
      costPerItem: pCostPerItem ? parseFloat(pCostPerItem) : undefined,
      chargeTax: pChargeTax,
      sku: pSku,
      barcode: pBarcode,
      trackInventory: pTrackInventory,
      quantity: pQuantity ? parseInt(pQuantity, 10) : 0,
      weight: pWeight ? parseFloat(pWeight) : 0,
      weightUnit: pWeightUnit,
      vendor: pVendor,
      productType: pProductType,
      tags: pTags.split(',').map(s => s.trim()).filter(Boolean),
      seoTitle: pSeoTitle,
      seoDescription: pSeoDescription,
    };

    const url = selectedProduct
      ? `${apiBase}/api/products/${pId}`
      : `${apiBase}/api/products`;

    const method = selectedProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save product failed');

      alert(selectedProduct ? 'Product updated successfully.' : 'Product created successfully.');
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      alert('Error saving product.');
    }
  };

  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setPDescription(editorRef.current.innerHTML);
    }
  };

  // Compute dynamic pricing metrics
  const priceNum = parseFloat(pPrice) || 0;
  const costNum = parseFloat(pCostPerItem) || 0;
  const profit = priceNum - costNum;
  const margin = priceNum > 0 ? ((profit / priceNum) * 100).toFixed(1) : '0';

  // Parse tags
  const tagsList = pTags.split(',').map(s => s.trim()).filter(Boolean);
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tagsList.filter(t => t !== tagToRemove).join(', ');
    setPTags(newTags);
  };

  // Generate combinations
  const cols = pColors.split(',').map(s => s.trim()).filter(Boolean);
  const szs = pSizes.split(',').map(s => s.trim()).filter(Boolean);
  const generatedVariants: { name: string; sku: string; price: string; qty: string }[] = [];
  if (cols.length > 0 && szs.length > 0) {
    cols.forEach(c => {
      szs.forEach(s => {
        generatedVariants.push({
          name: `${c} / ${s}`,
          sku: pSku ? `${pSku}-${c.replace('#', '')}-${s}` : '',
          price: pPrice || '0.00',
          qty: pQuantity || '0'
        });
      });
    });
  } else if (cols.length > 0) {
    cols.forEach(c => {
      generatedVariants.push({
        name: c,
        sku: pSku ? `${pSku}-${c.replace('#', '')}` : '',
        price: pPrice || '0.00',
        qty: pQuantity || '0'
      });
    });
  } else if (szs.length > 0) {
    szs.forEach(s => {
      generatedVariants.push({
        name: s,
        sku: pSku ? `${pSku}-${s}` : '',
        price: pPrice || '0.00',
        qty: pQuantity || '0'
      });
    });
  }

  return (
    <div className="product-fullpage-editor animate-fade-in" onClick={e => e.stopPropagation()}>
      <form onSubmit={handleSaveProduct} className="flex flex-col h-full w-full">
        
        {/* Editor Header */}
        <div className="editor-header">
          <div className="flex items-center gap-4">
            <button type="button" className="editor-back-btn" onClick={onClose}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="editor-title">
                {selectedProduct ? `Modify catalog product: ${pId}` : 'Add Product to catalog'}
              </h3>
              <p className="editor-subtitle">
                {selectedProduct ? 'Update specifications, pricing structure, collections and assets' : 'Configure details and media assets to publish a new storefront entry'}
              </p>
            </div>
          </div>
          
          <div className="editor-header-actions flex items-center gap-3">
            <button type="button" className="btn-action-outline text-xs px-5 py-2.5" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs px-6 py-2.5 cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>{selectedProduct ? 'Update Catalog' : 'Publish Product'}</span>
            </button>
          </div>
        </div>

        {/* Split Screen Content Panel */}
        <div className="editor-content-grid">
          
          {/* Left Column: Form Controls */}
          <div className="editor-form-pane space-y-6">
            
            {/* Details Card */}
            <div className="form-card">
              <h4 className="form-section-title">Product Details</h4>
              
              <div className="form-group">
                <label>Product Title</label>
                <input 
                  type="text" 
                  className="form-input w-full" 
                  value={pName} 
                  onChange={e => setPName(e.target.value)} 
                  placeholder="e.g. Short sleeve t-shirt" 
                  required 
                />
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="m-0">Product Description</label>
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showCode ? 'Edit Rich Text' : 'View HTML Code'}</span>
                  </button>
                </div>

                {/* Rich Text Editor Toolbar */}
                {!showCode && (
                  <div className="editor-toolbar flex items-center gap-1.5 p-2 border border-zinc-200 border-b-0 rounded-t-lg bg-zinc-50 flex-wrap">
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('bold')}
                      className="toolbar-btn"
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('italic')}
                      className="toolbar-btn"
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('underline')}
                      className="toolbar-btn"
                      title="Underline"
                    >
                      <Underline size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => {
                        const url = prompt('Enter link URL (e.g. https://example.com):');
                        if (url) handleFormat('createLink', url);
                      }}
                      className="toolbar-btn"
                      title="Link"
                    >
                      <Link size={14} />
                    </button>
                    <span className="toolbar-divider" />
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('insertUnorderedList')}
                      className="toolbar-btn"
                      title="Bullet List"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('insertOrderedList')}
                      className="toolbar-btn"
                      title="Numbered List"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <span className="toolbar-divider" />
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('justifyLeft')}
                      className="toolbar-btn"
                      title="Align Left"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('justifyCenter')}
                      className="toolbar-btn"
                      title="Align Center"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleFormat('justifyRight')}
                      className="toolbar-btn"
                      title="Align Right"
                    >
                      <AlignRight size={14} />
                    </button>
                  </div>
                )}

                {/* Text Input Block */}
                {showCode ? (
                  <textarea
                    className="form-input w-full min-h-[160px] font-mono text-xs p-3 rounded-t-none"
                    value={pDescription}
                    onChange={e => setPDescription(e.target.value)}
                    placeholder="<p>Enter raw HTML description here...</p>"
                  />
                ) : (
                  <div
                    ref={editorRef}
                    contentEditable
                    className="rich-text-editor-box w-full min-h-[160px] p-3 border border-zinc-200 rounded-b-lg outline-none focus:border-[#008060] focus:ring-1 focus:ring-[#008060] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: pDescription }}
                    onInput={e => setPDescription(e.currentTarget.innerHTML)}
                    onBlur={e => setPDescription(e.currentTarget.innerHTML)}
                  />
                )}
              </div>
            </div>

            {/* Media Catalog Assets */}
            <div className="form-card">
              <h4 className="form-section-title">Media Catalog Assets</h4>
              
              <div className="form-group">
                <label>Remote Product Image Link (URL)</label>
                <input
                  type="url"
                  className="form-input w-full font-medium text-xs"
                  value={pImage}
                  onChange={e => { setPImage(e.target.value); setPImagePreview(e.target.value); }}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-group m-0">
                <label>Or Upload Local Media File</label>
                <div className="media-upload-zone">
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="local-media-file"
                    className="hidden-file-input" 
                    onChange={handleImageUpload} 
                  />
                  <label htmlFor="local-media-file" className="media-upload-label cursor-pointer">
                    <span className="media-upload-btn btn-action-outline">Upload new</span>
                    <span className="media-upload-text text-zinc-500 font-medium text-xs mt-1">Accepts images, videos, or 3D models</span>
                  </label>
                </div>
                {pImagePreview && (
                  <div className="upload-preview-wrapper mt-3 flex justify-center border-t border-zinc-100 pt-3">
                    <img src={pImagePreview} className="upload-preview" alt="Preview asset" />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="form-card">
              <h4 className="form-section-title">Pricing Structure</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Retail Price (INR)</label>
                  <input 
                    type="number" 
                    className="form-input w-full font-semibold" 
                    value={pPrice} 
                    onChange={e => setPPrice(e.target.value)} 
                    placeholder="₹ 0.00" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Compare-at Price (INR)</label>
                  <input 
                    type="number" 
                    className="form-input w-full font-semibold text-zinc-500" 
                    value={pCompareAtPrice} 
                    onChange={e => setPCompareAtPrice(e.target.value)} 
                    placeholder="₹ 0.00" 
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 align-items-center">
                <div className="form-group m-0">
                  <label>Cost per Item (INR)</label>
                  <input 
                    type="number" 
                    className="form-input w-full font-semibold text-zinc-500" 
                    value={pCostPerItem} 
                    onChange={e => setPCostPerItem(e.target.value)} 
                    placeholder="₹ 0.00" 
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Profit Margin</span>
                  <span className="text-sm font-black text-zinc-800 mt-1">{priceNum > 0 && costNum > 0 ? `${margin}%` : '-'}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estimated Profit</span>
                  <span className="text-sm font-black text-zinc-800 mt-1">{priceNum > 0 && costNum > 0 ? `₹${profit.toLocaleString('en-IN')}` : '-'}</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 mt-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={pChargeTax} 
                    onChange={e => setPChargeTax(e.target.checked)} 
                    className="rounded border-zinc-300 text-[#008060] focus:ring-0"
                  />
                  <span>Charge tax on this product</span>
                </label>
              </div>
            </div>

            {/* Inventory Card */}
            <div className="form-card">
              <h4 className="form-section-title">Inventory</h4>
              
              <div className="border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-700">Track inventory quantity</span>
                <label className="switch-toggle-wrap">
                  <input 
                    type="checkbox" 
                    checked={pTrackInventory} 
                    onChange={e => setPTrackInventory(e.target.checked)} 
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              {pTrackInventory && (
                <div className="bg-zinc-50 p-4 border border-zinc-200/60 rounded-xl mb-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Location Availability</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-700">Main Fulfillment Hub (India)</span>
                    <input 
                      type="number" 
                      className="form-input text-right w-24 font-bold" 
                      value={pQuantity} 
                      onChange={e => setPQuantity(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group m-0">
                  <label>SKU (Stock Keeping Unit)</label>
                  <input 
                    type="text" 
                    className="form-input w-full font-semibold" 
                    value={pSku} 
                    onChange={e => setPSku(e.target.value)} 
                    placeholder="e.g. HOOD-ESS-01" 
                  />
                </div>
                <div className="form-group m-0">
                  <label>Barcode (ISBN, UPC, GTIN)</label>
                  <input 
                    type="text" 
                    className="form-input w-full font-semibold" 
                    value={pBarcode} 
                    onChange={e => setPBarcode(e.target.value)} 
                    placeholder="e.g. 1902837482" 
                  />
                </div>
              </div>
            </div>

            {/* Shipping Card */}
            <div className="form-card">
              <h4 className="form-section-title">Shipping Specs</h4>

              <div className="border-b border-zinc-100 pb-4 mb-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-700">This is a physical product</span>
                <label className="switch-toggle-wrap">
                  <input 
                    type="checkbox" 
                    checked={pPhysicalProduct} 
                    onChange={e => setPPhysicalProduct(e.target.checked)} 
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              {pPhysicalProduct && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="form-group m-0">
                      <label>Product Weight</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="form-input w-full font-semibold" 
                        value={pWeight} 
                        onChange={e => setPWeight(e.target.value)} 
                      />
                    </div>
                    <div className="form-group m-0">
                      <label>Weight Unit</label>
                      <select 
                        className="status-select w-full text-xs font-semibold"
                        value={pWeightUnit}
                        onChange={e => setPWeightUnit(e.target.value)}
                      >
                        <option value="kg">kg (Kilograms)</option>
                        <option value="lb">lb (Pounds)</option>
                        <option value="g">g (Grams)</option>
                        <option value="oz">oz (Ounces)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
                    <div className="form-group m-0">
                      <label>Country / Region of Origin</label>
                      <input 
                        type="text" 
                        className="form-input w-full" 
                        value={pCountryOfOrigin} 
                        onChange={e => setPCountryOfOrigin(e.target.value)} 
                        placeholder="India" 
                      />
                    </div>
                    <div className="form-group m-0">
                      <label>HS (Harmonized System) Code</label>
                      <input 
                        type="text" 
                        className="form-input w-full" 
                        value={pHsCode} 
                        onChange={e => setPHsCode(e.target.value)} 
                        placeholder="e.g. 6109.10.00" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Variants Option Card */}
            <div className="form-card">
              <h4 className="form-section-title">Variants</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group m-0">
                  <label>Colors Option tags (Separated by commas)</label>
                  <input 
                    type="text" 
                    className="form-input w-full font-medium text-xs" 
                    value={pColors} 
                    onChange={e => setPColors(e.target.value)} 
                    placeholder="e.g. #000000, #FFFFFF, #ef4444" 
                  />
                </div>
                <div className="form-group m-0">
                  <label>Sizes Option tags (Separated by commas)</label>
                  <input 
                    type="text" 
                    className="form-input w-full font-medium text-xs" 
                    value={pSizes} 
                    onChange={e => setPSizes(e.target.value)} 
                    placeholder="e.g. S, M, L, XL" 
                  />
                </div>
              </div>

              {generatedVariants.length > 0 && (
                <div className="border-t border-zinc-100 pt-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">Generated Variant Combinations</span>
                  <div className="table-container border border-zinc-200 rounded-lg overflow-hidden">
                    <table className="custom-table m-0">
                      <thead>
                        <tr className="bg-zinc-50 text-zinc-500">
                          <th>Variant</th>
                          <th>Price</th>
                          <th>Computed SKU</th>
                          <th className="text-right">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedVariants.map((v, idx) => (
                          <tr key={idx}>
                            <td className="font-bold text-zinc-800 text-[11px]">{v.name}</td>
                            <td className="font-semibold text-zinc-500">₹{v.price}</td>
                            <td className="font-mono text-zinc-400 text-[10px]">{v.sku || 'Auto-generated'}</td>
                            <td className="text-right font-bold text-zinc-800 text-[11px]">{pTrackInventory ? v.qty : '∞'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Search Engine Listing SEO Card */}
            <div className="form-card">
              <div className="flex justify-between items-center mb-3">
                <h4 className="form-section-title m-0 border-0 p-0">Search engine listing</h4>
                <button 
                  type="button" 
                  onClick={() => setShowSeoEdit(!showSeoEdit)}
                  className="text-xs font-bold text-[#008060] hover:underline cursor-pointer"
                >
                  {showSeoEdit ? 'Collapse SEO Settings' : 'Edit SEO snippet'}
                </button>
              </div>

              {/* Google snippet mockup */}
              <div className="seo-google-snippet bg-zinc-50 p-4 border border-zinc-200/60 rounded-xl">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Search Result Preview</span>
                <div className="google-title text-[16px] font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {pSeoTitle || pName || 'Product Title Placeholder'}
                </div>
                <div className="google-url text-[11px] text-[#006621] mt-0.5 truncate">
                  {apiBase.replace(/\/$/, '')}/products/{pSku || pId || 'product-slug'}
                </div>
                <div 
                  className="google-description text-[12px] text-[#545454] mt-1 line-clamp-2 leading-relaxed"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {pSeoDescription || pDescription.replace(/<[^>]*>/g, '') || 'Add a customized title and description parameters to preview this product inside search engine listing feeds.'}
                </div>
              </div>

              {showSeoEdit && (
                <div className="border-t border-zinc-100 pt-4 mt-4 space-y-4 animate-fade-in">
                  <div className="form-group">
                    <div className="flex justify-between items-center mb-1">
                      <label className="m-0">SEO Page Title</label>
                      <span className="text-[10px] text-zinc-400 font-bold">{pSeoTitle.length} / 70 chars</span>
                    </div>
                    <input 
                      type="text" 
                      maxLength={70}
                      className="form-input w-full font-semibold"
                      value={pSeoTitle}
                      onChange={e => setPSeoTitle(e.target.value)}
                      placeholder={pName || 'Product Page Title'}
                    />
                  </div>

                  <div className="form-group m-0">
                    <div className="flex justify-between items-center mb-1">
                      <label className="m-0">SEO Meta Description</label>
                      <span className="text-[10px] text-zinc-400 font-bold">{pSeoDescription.length} / 320 chars</span>
                    </div>
                    <textarea 
                      maxLength={320}
                      className="form-input w-full min-h-[80px] text-xs leading-relaxed"
                      value={pSeoDescription}
                      onChange={e => setPSeoDescription(e.target.value)}
                      placeholder="Provide a search snippet hook..."
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sidebar Organization + Live Preview */}
          <div className="editor-preview-pane space-y-6">
            
            {/* Product Status Card */}
            <div className="form-card w-full m-0">
              <h4 className="form-section-title">Product Status</h4>
              <select
                value={pStatus}
                onChange={e => setPStatus(e.target.value)}
                className="status-select w-full text-xs font-bold capitalize"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Publishing Option Card */}
            <div className="form-card w-full m-0">
              <h4 className="form-section-title">Publishing Options</h4>
              <div className="space-y-3 font-semibold text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#008060]" />
                  <span>Storefront Channel (Online)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-zinc-400" />
                  <span>All catalogs & collections</span>
                </div>
              </div>
            </div>

            {/* Product Organization Panel */}
            <div className="form-card w-full m-0">
              <h4 className="form-section-title">Product Organization</h4>
              
              <div className="space-y-4">
                <div className="form-group m-0">
                  <label>Product Type</label>
                  <input 
                    type="text"
                    className="form-input w-full"
                    value={pProductType}
                    onChange={e => setPProductType(e.target.value)}
                    placeholder="e.g. Hoodies, Tees"
                  />
                </div>

                <div className="form-group m-0">
                  <label>Vendor</label>
                  <input 
                    type="text"
                    className="form-input w-full"
                    value={pVendor}
                    onChange={e => setPVendor(e.target.value)}
                    placeholder="e.g. Core Clothing Inc."
                  />
                </div>

                <div className="form-group m-0">
                  <label>Category</label>
                  <select 
                    className="status-select w-full text-xs font-semibold capitalize bg-white" 
                    value={pCategory} 
                    onChange={e => setPCategory(e.target.value)}
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="tees">Tees</option>
                    <option value="jeans">Jeans</option>
                    <option value="shirts">Shirts</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group m-0">
                  <label>Collection</label>
                  <select 
                    className="status-select w-full text-xs font-semibold capitalize bg-white" 
                    value={pCollection} 
                    onChange={e => setPCollection(e.target.value)}
                  >
                    <option value="core essentials">Core Essentials</option>
                    <option value="new arrivals">New Arrivals</option>
                    <option value="summer drop">Summer Drop</option>
                    <option value="street archive">Street Archive</option>
                  </select>
                </div>

                <div className="form-group m-0">
                  <label className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Tags (Separated by commas)</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input w-full"
                    value={pTags}
                    onChange={e => setPTags(e.target.value)}
                    placeholder="e.g. new, cotton, premium"
                  />
                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tagsList.map(tag => (
                        <span key={tag} className="tag-chip flex items-center gap-1 text-[10px] font-bold bg-zinc-100 border border-zinc-200 rounded-full px-2.5 py-1 text-zinc-700">
                          <span>{tag}</span>
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[12px] leading-none text-zinc-400 hover:text-zinc-600 focus:outline-none select-none">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Storefront Card Preview Card */}
            <div className="w-full flex flex-col items-center">
              <div className="preview-pane-header self-center text-center m-0 mb-4">
                <h4 className="preview-pane-title">Storefront Live Preview</h4>
                <p className="preview-pane-subtitle">Visual rendering inside store product feeds.</p>
              </div>

              <div className="mockup-card-container w-full flex justify-center">
                <div className="mockup-card">
                  {/* Image Block */}
                  <div className="mockup-image-wrap">
                    {pImagePreview ? (
                      <img src={pImagePreview} className="mockup-image" alt="Visual Preview" onError={() => setPImagePreview('')} />
                    ) : (
                      <div className="mockup-image-placeholder">
                        <Eye size={28} strokeWidth={1.5} />
                        <span>Awaiting Media</span>
                      </div>
                    )}
                    
                    {/* Discount Label */}
                    {pPrice && pCompareAtPrice && parseFloat(pCompareAtPrice) > parseFloat(pPrice) && (
                      <span className="mockup-discount-badge">
                        -{Math.round(((parseFloat(pCompareAtPrice) - parseFloat(pPrice)) / parseFloat(pCompareAtPrice)) * 100)}% OFF
                      </span>
                    )}

                    {/* Collection badge */}
                    {pCollection && (
                      <span className="mockup-collection-badge">
                        {pCollection}
                      </span>
                    )}
                  </div>

                  {/* Meta Details */}
                  <div className="mockup-details">
                    <div className="mockup-meta">
                      <span className="mockup-category">{pCategory || 'hoodies'}</span>
                      <span className="mockup-gender">{pGender || 'unisex'}</span>
                    </div>
                    
                    <h4 className="mockup-title">
                      {pName || 'Product Title Placeholder'}
                    </h4>

                    <div className="mockup-pricing">
                      <span className="mockup-price">
                        {pPrice ? `₹${parseFloat(pPrice).toLocaleString('en-IN')}` : '₹0'}
                      </span>
                      {pCompareAtPrice && parseFloat(pCompareAtPrice) > parseFloat(pPrice) && (
                        <span className="mockup-original-price">
                          ₹{parseFloat(pCompareAtPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Swatches */}
                    {pColors && pColors.trim() && (
                      <div className="mockup-colors pt-2">
                        <span className="mockup-label">Colors:</span>
                        <div className="mockup-color-list">
                          {pColors.split(',').map((color, idx) => {
                            const cleanColor = color.trim();
                            if (!cleanColor) return null;
                            return (
                              <span 
                                key={idx} 
                                className="mockup-color-dot"
                                style={{ backgroundColor: cleanColor }}
                                title={cleanColor}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {pSizes && pSizes.trim() && (
                      <div className="mockup-sizes">
                        <span className="mockup-label">Sizes:</span>
                        <div className="mockup-size-list">
                          {pSizes.split(',').map((size, idx) => {
                            const cleanSize = size.trim();
                            if (!cleanSize) return null;
                            return (
                              <span 
                                key={idx} 
                                className="mockup-size-badge"
                              >
                                {cleanSize}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
