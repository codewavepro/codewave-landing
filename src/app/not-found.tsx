import LocaleProvider from "@/providers/LocaleProvider";
import NotFoundClient from "@/components/NotFoundСlient/NotFoundClient";

export default async function NotFoundPage() {

  return (
      <LocaleProvider>
          <main>
              <NotFoundClient />
          </main>
      </LocaleProvider>
  );
}
