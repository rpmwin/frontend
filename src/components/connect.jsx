
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function connect() {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="max-w-md w-full space-y-6 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Connect with Others</h1>
            <p className="text-muted-foreground">
              Enter a code or generate a new one to start a connection.
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <Label htmlFor="code" className="block text-sm font-medium">
                Enter Code
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 block w-full rounded-md border-input bg-background text-foreground focus:border-primary focus:ring-primary"
                />
                <Button className="inline-flex items-center px-4 rounded-r-md border border-input bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-primary">
                  Connect
                </Button>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  const code = "ABC123";
                }}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-primary"
              >
                Generate Code
              </Button>
              <div className="mt-2 flex items-center justify-center">
                <span className="text-3xl font-bold">ABC123</span>
                <Button
                  onClick={() => {}}
                  className="ml-4 inline-flex items-center px-4 rounded-md border border-input bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-primary"
                >
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
              prefetch={false}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
