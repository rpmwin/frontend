"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGlobalState } from "../globalcontext";
import { useSocket } from "../socketcontext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";

function connect() {
  const router = useRouter();
  const socket = useSocket();
  const [requestId, setRequestId] = useState("");
  const [code, setCode] = useState("");
  const [connectionCode, setConnectionCode] = useState("");
  const { isConnected, setIsConnected, setRoom } = useGlobalState();

  useEffect(() => {
    if (socket) {
      socket.on("codeGenerated", handleCodeGenerated);
      socket.on("RequestingToConnect", handleRequestingToConnect);
      socket.on("ConnectionAccepted", handleConnectionAccepted);

      return () => {
        socket.off("codeGenerated", handleCodeGenerated);
        socket.off("RequestingToConnect", handleRequestingToConnect);
        socket.off("ConnectionAccepted", handleConnectionAccepted);
      };
    }
  }, [socket]);

  const handleCodeGenerated = useCallback((code) => {
    setCode(code);
  }, []);

  const handleRequestingToConnect = useCallback((data) => {
    const { user, code } = data;
    toast.success(`Requesting to connect with ${user}`);
    setRequestId(user);
    setConnectionCode(code);
  }, []);

  const handleConnectionAccepted = useCallback((data) => {
    const { my_id, other_id, room_id } = data;
    setRoom(room_id);
    setIsConnected(true);

    toast.success(`Connection established with ${other_id}`);

    setTimeout(() => {
      router.push(`/share`);
    }, 3000);
  }, []);

  const handleGenerateCode = () => {
    socket.emit("generateCode");
  };

  const handleConnect = () => {
    if (connectionCode) {
      console.log(connectionCode);
      socket.emit("connectWithCode", { connectionCode });
    }
  };

  const handleConfirmConnect = () => {
    socket.emit("acceptConnection", { connectionCode, user_b: requestId });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-black to-white">
      <div className=" bg-slate-900 bg-opacity-20 max-w-md w-full space-y-6 px-2 py-10 rounded-xl shadow-xl border border-stone-800">
        <div className="max-w-md w-full space-y-6 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold pb-3 mb-2 border-b">
              Connect with Others
            </h1>
            <p className="text-muted-foreground text-white">
              Enter a code or generate a new one to start a connection.
            </p>
          </div>
          {requestId !== "" ? (
            <div className="bg-card rounded-lg shadow-sm p-6 space-y-4">
              <div>Connect to this user with the code {requestId}</div>

              <Button
                onClick={handleConfirmConnect}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-primary"
              >
                Confirm Connect
              </Button>
            </div>
          ) : (
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
                    onChange={(e) => setConnectionCode(e.target.value)}
                    className="flex-1 block w-full rounded-md border-input bg-background text-foreground focus:border-primary focus:ring-primary"
                  />
                  <Button
                    onClick={handleConnect}
                    className="inline-flex items-center px-4 rounded-r-md border border-input bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-primary"
                  >
                    Connect
                  </Button>
                </div>
              </div>
              <div>
                <Button
                  onClick={handleGenerateCode}
                  className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-primary"
                >
                  Generate Code
                </Button>
                <div className="mt-2 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {" "}
                    {code === "" ? " " : code}
                  </span>
                  <Button
                    onClick={() => copyToClipboard(code)}
                    className="ml-4 inline-flex items-center px-4 rounded-md border border-input bg-background text-foreground hover:bg-slate-300 duration-300 focus:outline-none focus:ring-primary"
                  >
                    Copy Code
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="text-center flex justify-center">
            <Button className=" flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-primary text-white">
              <Link
                href="#"
                className=" text-white text-sm text-muted-foreground hover:underline"
                prefetch={false}
              >
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default connect;
