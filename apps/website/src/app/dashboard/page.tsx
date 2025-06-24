import { Button } from "@/components/ui/button";

import { AristocratPageHeader } from "./components/header";
import { AristocratPageWrapper } from "./components/wrapper";
import { AristocratIcons } from "@/components/icons";

const AristocratDashboardPage = () => (
  <AristocratPageWrapper>
    <header className="w-full flex items-center justify-between">
      <AristocratPageHeader
        title="Aristocrat Dashboard"
        description="Manage your Aristocrat settings and preferences."
      />

      <Button className="h-12" variant="default">
        <AristocratIcons.Stars />
        Generate Course
      </Button>
    </header>
    Cardsss
  </AristocratPageWrapper>
);

export default AristocratDashboardPage;
