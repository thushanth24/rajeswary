import { Layout } from "@/components/layout/Layout";
import { menus } from "@/data/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Leaf, Drumstick } from "lucide-react";
import { FloatingElements } from "@/components/animations/FloatingElements";
import { RangoliPattern } from "@/components/animations/RangoliPattern";
import { DecorativeBorder } from "@/components/animations/DecorativeBorder";
import { CTASection } from "@/components/home/CTASection";

const MenusPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/20 via-card to-background overflow-hidden">
        <FloatingElements type="petals" density="low" />
        <RangoliPattern position="center" size="lg" opacity={0.08} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          {/* Decorative Top Element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-secondary text-2xl">🪔</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          
          <span className="text-secondary font-medium tracking-wider uppercase text-sm animate-fade-in">
            ✦ Traditional Jaffna Cuisine ✦
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 animate-fade-in-up">
            Virundhu <span className="text-gradient-gold">Menu</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Delight your guests with our authentic Jaffna cuisine. From traditional 
            banana leaf feast to contemporary selections, our expert cooks create 
            divine culinary experiences.
          </p>
          
          {/* Decorative Divider */}
          <div className="divider-ornate mt-8" />
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="relative py-20 bg-background overflow-hidden">
        <DecorativeBorder position="top" />
        <div className="absolute inset-0 paisley-bg opacity-20" />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <Tabs defaultValue="lunch" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-card border border-border">
              <TabsTrigger value="breakfast" className="font-serif data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                காலை உணவு
              </TabsTrigger>
              <TabsTrigger value="lunch" className="font-serif data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                மதிய விருந்து
              </TabsTrigger>
              <TabsTrigger value="dinner" className="font-serif data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                இரவு விருந்து
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breakfast">
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {menus.breakfast.map((menu, index) => (
                  <Card 
                    key={menu.id} 
                    className="card-traditional animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="font-serif text-xl flex justify-between items-center">
                        <span className="text-gradient-gold">{menu.name}</span>
                        <span className="text-secondary font-sans text-lg">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-secondary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lunch">
              <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                {menus.lunch.map((menu, index) => (
                  <Card 
                    key={menu.id} 
                    className="card-traditional animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="font-serif text-xl">
                        <span className="text-gradient-gold">{menu.name}</span>
                        <span className="block text-secondary font-sans text-lg mt-1">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-secondary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dinner">
              <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                {menus.dinner.map((menu, index) => (
                  <Card 
                    key={menu.id} 
                    className="card-traditional animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="font-serif text-xl">
                        <span className="text-gradient-gold">{menu.name}</span>
                        <span className="block text-secondary font-sans text-lg mt-1">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-secondary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DecorativeBorder position="bottom" />
      </section>

      {/* Dietary Options */}
      <section className="relative py-20 bg-card overflow-hidden">
        <RangoliPattern position="corners" size="sm" opacity={0.1} />
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary text-3xl">🪷</span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-4 mb-4">
              Dietary <span className="text-gradient-gold">Options</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We honor all dietary traditions and requirements with respect.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-6 card-traditional animate-fade-in-up">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center gold-shimmer">
                <Leaf className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground text-lg">சைவ உணவு (Vegetarian)</h3>
                <p className="text-sm text-muted-foreground">
                  Full vegetarian menu with pure sattvic options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 card-traditional animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full flex items-center justify-center gold-shimmer">
                <Drumstick className="h-7 w-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground text-lg">அசைவம் (Non-Vegetarian)</h3>
                <p className="text-sm text-muted-foreground">
                  Premium Jaffna-style seafood and meat selections
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default MenusPage;
