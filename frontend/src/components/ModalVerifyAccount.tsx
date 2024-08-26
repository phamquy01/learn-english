'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckIcon,
  FileIcon,
  RocketIcon,
  SewingPinFilledIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import {
  VerifyCodeBody,
  VerifyCodeBodyType,
} from '@/schemaValidations/auth.schema';
import { Input } from '@/components/ui/input';
import {
  ResendEmailBody,
  ResendEmailBodyType,
} from '@/schemaValidations/user.schema';
import apiAuthRequest from '@/apiRequests/auth';
import { handleErrorApi } from '@/lib/utils';
import { set } from 'zod';

export function ModalVerifyAccount({
  isModalOpen,
  setIsModalOpen,
  userEmail,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  userEmail: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(33.33);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState('');
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    setProgress(progress + 33.33);
  };
  const active = 'primary';
  const inactive = 'muted-foreground';
  const formStep0 = useForm<ResendEmailBodyType>({
    resolver: zodResolver(ResendEmailBody),
    defaultValues: {
      email: userEmail,
    },
  });

  const formStep1 = useForm<VerifyCodeBodyType>({
    resolver: zodResolver(VerifyCodeBody),
    defaultValues: {
      id: userId,
      code: '',
    },
  });

  async function onSubmit(values: ResendEmailBodyType) {
    if (loading) return;
    setLoading(true);

    try {
      const result = await apiAuthRequest.resendEmail(values);
      toast({
        description: result.payload.message,
      });
      setUserId(result.payload.id);
      handleNextStep();
    } catch (error: any) {
      handleErrorApi({ error, setError: formStep0.setError });
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitStep1(values: VerifyCodeBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.checkCode(values);
      toast({
        description: result.payload.message,
      });
      handleNextStep();
    } catch (error: any) {
      handleErrorApi({ error, setError: formStep1.setError });
    } finally {
      setLoading(false);
    }
  }

  const handleSkip = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (userId) {
      formStep1.setValue('id', userId);
    }
  }, [formStep1, userId]);

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between items-center mb-5">
            <AlertDialogTitle>Verify your account</AlertDialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Skip</span>
              <Button variant="ghost" size="icon">
                <CheckIcon className="w-4 h-4" onClick={() => handleSkip()} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-4">
                <button
                  className={`flex flex-col items-center gap-2 text-${
                    currentStep >= 0 ? active : inactive
                  }`}
                >
                  <FileIcon className="w-8 h-8" />
                  <span
                    className={`text-xs font-bold text-${
                      currentStep >= 0 ? active : inactive
                    }`}
                  >
                    Send code
                  </span>
                </button>
                <div
                  className={`h-1 w-20 bg-${
                    currentStep >= 1 ? active : inactive
                  } rounded-sm`}
                />
                <button
                  className={`flex flex-col items-center gap-2 text-${
                    currentStep >= 1 ? active : inactive
                  }`}
                >
                  <FileIcon className="w-8 h-8" />
                  <span
                    className={`text-xs font-bold text-${
                      currentStep >= 1 ? active : inactive
                    }`}
                  >
                    Verification
                  </span>
                </button>
                <div
                  className={`h-1 w-20 bg-${
                    currentStep >= 2 ? active : inactive
                  } rounded-sm`}
                />
                <button
                  className={`flex flex-col items-center gap-2 text-${
                    currentStep >= 2 ? active : inactive
                  }`}
                >
                  <SewingPinFilledIcon className="w-8 h-8" />
                  <span
                    className={`text-xs font-bold text-${
                      currentStep >= 2 ? active : inactive
                    }`}
                  >
                    Done
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-6">
              {currentStep === 0 && (
                <Form {...formStep0}>
                  <form
                    onSubmit={formStep0.handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                  >
                    <FormField
                      control={formStep0.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-muted-foreground">
                            Tài khoản của bạn chưa được kích hoạt
                          </FormLabel>
                          <FormControl className="mt-1">
                            <Input
                              disabled
                              className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      type="submit"
                    >
                      Resend
                    </Button>
                  </form>
                </Form>
              )}
              {currentStep === 1 && (
                <Form {...formStep1}>
                  <form
                    onSubmit={formStep1.handleSubmit(onSubmitStep1)}
                    className="space-y-6"
                    noValidate
                  >
                    <FormField
                      control={formStep1.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="mt-1">
                            <Input
                              className=" w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm hidden "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formStep1.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-muted-foreground">
                            Code
                          </FormLabel>
                          <FormControl className="mt-1">
                            <Input
                              className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      type="submit"
                    >
                      Verify
                    </Button>
                  </form>
                </Form>
              )}
              {currentStep === 2 && (
                <>You has been verified. Please login to continue</>
              )}
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
