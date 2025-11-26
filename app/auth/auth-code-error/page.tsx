import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-amber-950/20 p-4">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem verifying your email. The link may have expired
            or is invalid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>This could happen if:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The verification link has expired</li>
              <li>The link has already been used</li>
              <li>The link was copied incorrectly</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/signup">Try signing up again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


