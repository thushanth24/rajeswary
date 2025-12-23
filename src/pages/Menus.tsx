import { Layout } from "@/components/layout/Layout";
import { menus } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Calendar, Check, Leaf, Drumstick } from "lucide-react";

const MenusPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Culinary Excellence
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Menu Options
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Delight your guests with our exquisite culinary offerings. From traditional 
            favorites to contemporary cuisines, our expert chefs create memorable dining experiences.
          </p>
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <Tabs defaultValue="lunch" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>

            <TabsContent value="breakfast">
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {menus.breakfast.map((menu) => (
                  <Card key={menu.id} className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-xl flex justify-between items-center">
                        {menu.name}
                        <span className="text-primary font-sans text-lg">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-primary" />
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
                {menus.lunch.map((menu) => (
                  <Card key={menu.id} className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-xl">
                        {menu.name}
                        <span className="block text-primary font-sans text-lg mt-1">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-primary" />
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
                {menus.dinner.map((menu) => (
                  <Card key={menu.id} className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-xl">
                        {menu.name}
                        <span className="block text-primary font-sans text-lg mt-1">
                          {menu.price}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {menu.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-primary" />
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
      </section>

      {/* Dietary Options */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Dietary Options
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We cater to all dietary preferences and requirements.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vegetarian</h3>
                <p className="text-sm text-muted-foreground">
                  Full vegetarian menu options available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-background rounded-lg border border-border">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Drumstick className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Non-Vegetarian</h3>
                <p className="text-sm text-muted-foreground">
                  Premium meat and seafood selections
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Note */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            Menu Customization
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            All menus can be customized based on your preferences. Our culinary team 
            will work with you to create the perfect menu for your event. Final menu 
            selection is made during the booking process.
          </p>
          <Button size="lg" asChild>
            <Link to="/booking">
              <Calendar className="mr-2 h-5 w-5" />
              Select Menu & Book
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default MenusPage;
