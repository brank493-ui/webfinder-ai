'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Move,
  Type,
  Image,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link2,
  Trash2,
  Copy,
  Eye,
  Save,
  Undo,
  Redo,
  Sparkles,
  Layout,
  Layers,
  Palette,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface EditorBlock {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'services' | 'testimonials' | 'contact' | 'cta' | 'spacer';
  content: Record<string, unknown>;
  styles: Record<string, string>;
  order: number;
}

const defaultBlocks: EditorBlock[] = [
  {
    id: 'block_1',
    type: 'hero',
    content: {
      title: 'Welcome to Your Business',
      subtitle: 'Professional services for your needs',
      buttonText: 'Get Started',
    },
    styles: {
      backgroundColor: '#2563EB',
      textColor: '#FFFFFF',
      textAlign: 'center',
      padding: '4rem',
    },
    order: 0,
  },
  {
    id: 'block_2',
    type: 'services',
    content: {
      title: 'Our Services',
      services: [
        { title: 'Service 1', description: 'Description for service 1' },
        { title: 'Service 2', description: 'Description for service 2' },
        { title: 'Service 3', description: 'Description for service 3' },
      ],
    },
    styles: {
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      textAlign: 'center',
      padding: '3rem',
    },
    order: 1,
  },
  {
    id: 'block_3',
    type: 'contact',
    content: {
      title: 'Contact Us',
      address: '123 Business Street, City',
      phone: '+1 234 567 890',
      email: 'contact@business.com',
    },
    styles: {
      backgroundColor: '#F3F4F6',
      textColor: '#1F2937',
      textAlign: 'center',
      padding: '3rem',
    },
    order: 2,
  },
];

const blockTemplates = [
  { type: 'hero', name: 'Hero Section', icon: Layout },
  { type: 'text', name: 'Text Block', icon: Type },
  { type: 'image', name: 'Image', icon: Image },
  { type: 'gallery', name: 'Gallery', icon: Square },
  { type: 'services', name: 'Services Grid', icon: Layers },
  { type: 'testimonials', name: 'Testimonials', icon: Type },
  { type: 'contact', name: 'Contact Form', icon: AlignLeft },
  { type: 'cta', name: 'Call to Action', icon: Sparkles },
  { type: 'spacer', name: 'Spacer', icon: Move },
];

export function WebsiteEditor({ projectId }: { projectId: string }) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(defaultBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      } else if (direction === 'down' && index < prev.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      }
      return newBlocks.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedBlock(null);
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (!block) return prev;
      
      const newBlock: EditorBlock = {
        ...block,
        id: `block_${Date.now()}`,
        order: block.order + 1,
      };
      
      const newBlocks = [...prev];
      newBlocks.splice(block.order + 1, 0, newBlock);
      return newBlocks.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const addBlock = useCallback((type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: `block_${Date.now()}`,
      type,
      content: {},
      styles: {
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        textAlign: 'left',
        padding: '2rem',
      },
      order: blocks.length,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setShowAddBlock(false);
    setSelectedBlock(newBlock.id);
  }, [blocks.length]);

  const generateWithAI = async () => {
    setAiGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAiGenerating(false);
  };

  const saveWebsite = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const selectedBlockData = blocks.find((b) => b.id === selectedBlock);

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Redo">
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('desktop')}
            className={viewMode === 'desktop' ? 'bg-muted' : ''}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('tablet')}
            className={viewMode === 'tablet' ? 'bg-muted' : ''}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('mobile')}
            className={viewMode === 'mobile' ? 'bg-muted' : ''}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={generateWithAI} disabled={aiGenerating}>
            {aiGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            AI Generate
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={saveWebsite} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Block List */}
        <div className="w-64 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              <span>Blocks</span>
              <Dialog open={showAddBlock} onOpenChange={setShowAddBlock}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Block</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-3 py-4">
                    {blockTemplates.map((template) => (
                      <Button
                        key={template.type}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => addBlock(template.type as EditorBlock['type'])}
                      >
                        <template.icon className="h-5 w-5" />
                        <span className="text-xs">{template.name}</span>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </h3>

            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBlock === block.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-border hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedBlock(block.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{block.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, 'up');
                      }}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, 'down');
                      }}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateBlock(block.id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
          <div
            className={`mx-auto bg-white dark:bg-gray-800 shadow-xl transition-all ${
              viewMode === 'desktop'
                ? 'max-w-5xl'
                : viewMode === 'tablet'
                ? 'max-w-2xl'
                : 'max-w-sm'
            }`}
          >
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`relative group cursor-pointer ${
                  selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedBlock(block.id)}
                style={{
                  backgroundColor: block.styles.backgroundColor,
                  padding: block.styles.padding,
                }}
              >
                {/* Block Content */}
                {block.type === 'hero' && (
                  <div className="text-center" style={{ color: block.styles.textColor }}>
                    <h1 className="text-4xl font-bold mb-4">
                      {(block.content.title as string) || 'Hero Title'}
                    </h1>
                    <p className="text-xl mb-6 opacity-90">
                      {(block.content.subtitle as string) || 'Hero subtitle'}
                    </p>
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium">
                      {(block.content.buttonText as string) || 'Get Started'}
                    </button>
                  </div>
                )}

                {block.type === 'services' && (
                  <div style={{ color: block.styles.textColor }}>
                    <h2 className="text-2xl font-bold text-center mb-8">
                      {(block.content.title as string) || 'Our Services'}
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                      {((block.content.services as Array<{ title: string; description: string }>) || []).map(
                        (service, i) => (
                          <div key={i} className="text-center p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">{service.title}</h3>
                            <p className="text-sm opacity-70">{service.description}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {block.type === 'contact' && (
                  <div style={{ color: block.styles.textColor }}>
                    <h2 className="text-2xl font-bold text-center mb-6">
                      {(block.content.title as string) || 'Contact Us'}
                    </h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p>{(block.content.address as string) || 'Address'}</p>
                        <p>{(block.content.phone as string) || 'Phone'}</p>
                        <p>{(block.content.email as string) || 'Email'}</p>
                      </div>
                      <div className="space-y-3">
                        <Input placeholder="Name" />
                        <Input placeholder="Email" />
                        <Textarea placeholder="Message" rows={3} />
                        <Button>Send Message</Button>
                      </div>
                    </div>
                  </div>
                )}

                {block.type === 'text' && (
                  <div style={{ color: block.styles.textColor }}>
                    <p className="text-lg">
                      {(block.content.text as string) || 'Click to edit text content...'}
                    </p>
                  </div>
                )}

                {block.type === 'spacer' && (
                  <div className="h-16 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    Spacer
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-72 border-l bg-muted/30 overflow-y-auto">
          <Tabs defaultValue="content" className="h-full">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger value="content" className="rounded-none">
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="rounded-none">
                Style
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="p-4 mt-0">
              {selectedBlockData ? (
                <div className="space-y-4">
                  <h4 className="font-semibold capitalize">{selectedBlockData.type} Content</h4>

                  {selectedBlockData.type === 'hero' && (
                    <>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={selectedBlockData.content.title as string}
                          onChange={(e) => {
                            setBlocks((prev) =>
                              prev.map((b) =>
                                b.id === selectedBlock
                                  ? { ...b, content: { ...b.content, title: e.target.value } }
                                  : b
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={selectedBlockData.content.subtitle as string}
                          onChange={(e) => {
                            setBlocks((prev) =>
                              prev.map((b) =>
                                b.id === selectedBlock
                                  ? { ...b, content: { ...b.content, subtitle: e.target.value } }
                                  : b
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={selectedBlockData.content.buttonText as string}
                          onChange={(e) => {
                            setBlocks((prev) =>
                              prev.map((b) =>
                                b.id === selectedBlock
                                  ? { ...b, content: { ...b.content, buttonText: e.target.value } }
                                  : b
                              )
                            );
                          }}
                        />
                      </div>
                    </>
                  )}

                  {selectedBlockData.type === 'services' && (
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={selectedBlockData.content.title as string}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, content: { ...b.content, title: e.target.value } }
                                : b
                            )
                          );
                        }}
                      />
                    </div>
                  )}

                  {selectedBlockData.type === 'text' && (
                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <Textarea
                        value={selectedBlockData.content.text as string}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, content: { ...b.content, text: e.target.value } }
                                : b
                            )
                          );
                        }}
                        rows={6}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a block to edit</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="p-4 mt-0">
              {selectedBlockData ? (
                <div className="space-y-4">
                  <h4 className="font-semibold">Block Styles</h4>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedBlockData.styles.backgroundColor}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, styles: { ...b.styles, backgroundColor: e.target.value } }
                                : b
                            )
                          );
                        }}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={selectedBlockData.styles.backgroundColor}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, styles: { ...b.styles, backgroundColor: e.target.value } }
                                : b
                            )
                          );
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedBlockData.styles.textColor}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, styles: { ...b.styles, textColor: e.target.value } }
                                : b
                            )
                          );
                        }}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={selectedBlockData.styles.textColor}
                        onChange={(e) => {
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === selectedBlock
                                ? { ...b, styles: { ...b.styles, textColor: e.target.value } }
                                : b
                            )
                          );
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <Select
                      value={selectedBlockData.styles.textAlign}
                      onValueChange={(v) => {
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === selectedBlock
                              ? { ...b, styles: { ...b.styles, textAlign: v } }
                              : b
                          )
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Padding</Label>
                    <Select
                      value={selectedBlockData.styles.padding}
                      onValueChange={(v) => {
                        setBlocks((prev) =>
                          prev.map((b) =>
                            b.id === selectedBlock
                              ? { ...b, styles: { ...b.styles, padding: v } }
                              : b
                          )
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1rem">Small</SelectItem>
                        <SelectItem value="2rem">Medium</SelectItem>
                        <SelectItem value="3rem">Large</SelectItem>
                        <SelectItem value="4rem">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a block to style</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
