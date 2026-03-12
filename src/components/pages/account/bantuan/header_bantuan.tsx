import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Header_bantuan = () => {
  return (
    <Card>
      <CardContent>
        <h1 className="text-36 font-bold text-center mb-2">
          Hai, ada yang bisa kami bantu?
        </h1>
        {/* Search */}
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari sesuatu..."
                  className="w-full pl-10 h-12 pr-4 py-2 rounded-full bg-khaffah-neutral-light text-sm focus:outline-none focus:ring-2 focus:ring-khaffah-primary focus:border-transparent"
                />
              </div>
            </div>
            <Button
              type="button"
              className="bg-khaffah-primary hover:bg-khaffah-primary/90 rounded-xl px-4 md:px-5 h-9 md:h-10 md:text-12 lg:text-14 text-white"
            >
              Cari Sekarang
            </Button>
          </div>
        </CardContent>
      </CardContent>
    </Card>
  );
};
export default Header_bantuan;
