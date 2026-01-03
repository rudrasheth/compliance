import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Terminal, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { verifyEmail, resendOTP } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const message = location.state?.message;

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    // Start countdown for resend button
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyEmail(email, otp);
      
      if (result.success) {
        toast({
          title: "Email verified successfully!",
          description: "Welcome to ComplianceOS. Your account is now active.",
        });
        navigate("/", { replace: true });
      } else {
        setError(result.message || "Verification failed");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setError("");

    try {
      const result = await resendOTP(email);
      
      if (result.success) {
        toast({
          title: "Verification code sent",
          description: "A new verification code has been sent to your email.",
        });
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.message || "Failed to resend verification code");
      }
    } catch (error) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError("");
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
              <Terminal className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ComplianceOS</span>
          </div>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Verify your email</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-foreground">{email}</p>
        </div>

        {/* Verification Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Enter verification code</CardTitle>
            <CardDescription>
              {message || "Please enter the 6-digit code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                  required
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Didn't receive the code?
              </div>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isResending || countdown > 0}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>

              <div className="text-sm">
                <Link
                  to="/login"
                  className="text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>
            Check your spam folder if you don't see the email in your inbox.
          </p>
          <p>
            The verification code expires in 10 minutes for security.
          </p>
        </div>
      </div>
    </div>
  );
}