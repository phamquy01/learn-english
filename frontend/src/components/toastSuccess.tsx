import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default function ToastSuccess({ description }: { description: string }) {
  //   const [hidden, setHidden] = useState(false);
  //   const hadleClose = () => {
  //     setHidden(true);
  //   };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex w-[400px] max-w-full items-center rounded-md border border-input bg-background p-4 shadow-lg`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-green-50">
        <CheckIcon className="h-5 w-5" />
      </div>
      <div className="ml-4 flex-1 space-y-1">
        <p className="text-sm font-medium">câu trả lời đúng</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="ghost" size="icon" className="ml-4">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
}
