'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/layouts/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Palette, 
  Plug, 
  Database, 
  Shield, 
  Users, 
  User,
  X,
  Monitor,
  Sun,
  Moon,
  Globe,
  Volume2
} from 'lucide-react';

const settingsCategories = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'apps', label: 'Apps & Connectors', icon: Plug },
  { id: 'data', label: 'Data controls', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'parental', label: 'Parental controls', icon: Users },
  { id: 'account', label: 'Account', icon: User },
];

const themes = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

const voices = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    voice: 'alloy',
    notifications: true,
    soundEffects: true,
    separateVoiceMode: false,
    autoDetectLanguage: true,
    dataSharing: false,
    analytics: true,
    voiceSpeed: [1],
  });

  const updateSetting = (key: string, value: string | boolean | number[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div className="flex items-center gap-2">
                      <theme.icon className="h-4 w-4" />
                      {theme.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full cursor-pointer border-2 border-white shadow-sm" />
            <div className="w-6 h-6 bg-green-500 rounded-full cursor-pointer" />
            <div className="w-6 h-6 bg-purple-500 rounded-full cursor-pointer" />
            <div className="w-6 h-6 bg-orange-500 rounded-full cursor-pointer" />
            <div className="w-6 h-6 bg-red-500 rounded-full cursor-pointer" />
            <Label className="text-sm text-muted-foreground ml-2">Accent color</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Language</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="language">Interface language</Label>
          <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Spoken language</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-detect</Label>
              <p className="text-sm text-muted-foreground">
                For best results, select the language you mainly speak. If it&apos;s not listed, it may still be supported via auto-detection.
              </p>
            </div>
            <Switch 
              checked={settings.autoDetectLanguage}
              onCheckedChange={(checked) => updateSetting('autoDetectLanguage', checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Voice</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Label>Voice</Label>
            </div>
            <Select value={settings.voice} onValueChange={(value) => updateSetting('voice', value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    {voice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Separate voice mode</Label>
              <Switch 
                checked={settings.separateVoiceMode}
                onCheckedChange={(checked) => updateSetting('separateVoiceMode', checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Keep ChatGPT Voice in a separate, full screen, without real time transcripts and visuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about important updates</p>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Sound effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
            </div>
            <Switch 
              checked={settings.soundEffects}
              onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalization = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Custom Instructions</h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How would you like ChatGPT to respond?</CardTitle>
            <CardDescription>
              Give ChatGPT instructions about how you&apos;d like it to respond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea 
              className="w-full h-32 p-3 border rounded-md resize-none"
              placeholder="e.g., I'm a software developer working on web applications..."
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Memory</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Memory</Label>
                <p className="text-sm text-muted-foreground">
                  ChatGPT will remember things about you from your conversations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAppsConnectors = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Connected Apps</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Connect apps to enhance your ChatGPT experience
        </p>
        <div className="space-y-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <Plug className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Label>Code Interpreter</Label>
                  <p className="text-xs text-muted-foreground">Run Python code and analyze data</p>
                </div>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Label>Web Browsing</Label>
                  <p className="text-xs text-muted-foreground">Browse the web for current information</p>
                </div>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDataControls = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Data Usage</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Improve model for everyone</Label>
              <p className="text-sm text-muted-foreground">
                Allow your conversations to be used to train future models
              </p>
            </div>
            <Switch 
              checked={settings.dataSharing}
              onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve our service with usage analytics</p>
            </div>
            <Switch 
              checked={settings.analytics}
              onCheckedChange={(checked) => updateSetting('analytics', checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Export Data</h3>
        <Card>
          <CardContent className="pt-6">
            <Button variant="outline" className="w-full">
              Export conversations
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Download all your conversation history
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotifications();
      case 'personalization':
        return renderPersonalization();
      case 'apps':
        return renderAppsConnectors();
      case 'data':
        return renderDataControls();
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex h-full">
            {/* Settings Sidebar */}
            <div className="w-64 border-r bg-sidebar">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <nav className="space-y-1">
                  {settingsCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <category.icon className="mr-3 h-4 w-4" />
                      {category.label}
                    </Button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6 capitalize">
                  {settingsCategories.find(cat => cat.id === activeCategory)?.label}
                </h1>
                {renderContent()}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}