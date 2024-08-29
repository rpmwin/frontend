"use client";

import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useGlobalState } from "../globalcontext";
import { useSocket } from "../socketcontext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../ProtectedRoute";

function Share() {
  const socket = useSocket();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("shareText");
  const { isConnected, setIsConnected, setRoom, room } = useGlobalState();
  const [sharedText, setSharedText] = useState([]);
  const [sharedPassword, setSharedPassword] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    console.log(receivedMessages);
  }, [receivedMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("textShared", handleTextShared);
      socket.on("passwordShared", handlePasswordShared);
      return () => {
        socket.off("textShared", handleTextShared);
        socket.off("passwordShared", handlePasswordShared);
      };
    }
  }, [socket]);

  const handleTextShared = useCallback((data) => {
    const { text } = data;
    console.log(text);
    setReceivedMessages((prev) => [...prev, { type: "text", content: text }]);
  }, []);

  const handlePasswordShared = useCallback((data) => {
    const { password } = data;
    setReceivedMessages((prev) => [...prev, { type: "password", content: password }]);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleShareText = () => {
    console.log(sharedText);
    socket.emit("shareText", { text: sharedText, room: room });
  };
  const handleSharePassword = () => {
    socket.emit("sharePassword", { password: sharedPassword, room: room });
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-col p-8 gap-8 m-28 mx-auto max-w-4xl rounded-lg shadow-lg flex-1 bg-gray-300  ">
          <div className="bg-blue-500 text-white py-3 px-4 flex justify-between items-center shadow-md rounded-lg">
            <nav className="flex gap-4">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "shareText"
                    ? "bg-white text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
                onClick={() => handleTabChange("shareText")}
              >
                Share Text
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === "sharePassword"
                    ? "bg-white text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
                onClick={() => handleTabChange("sharePassword")}
              >
                Share Password
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === "shareFiles"
                    ? "bg-white text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
                onClick={() => handleTabChange("shareFiles")}
              >
                Share Files
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === "shareFolders"
                    ? "bg-white text-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
                onClick={() => handleTabChange("shareFolders")}
              >
                Share Folders
              </button>
            </nav>
          </div>
          {activeTab === "shareText" && (
            <div className="flex flex-col gap-4">
              <textarea
                className="bg-gray-100 text-gray-800 p-4 rounded-md shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter text to share"
                value={sharedText}
                onChange={(e) => setSharedText(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                onClick={handleShareText}
              >
                Share Text
              </button>
            </div>
          )}
          {activeTab === "sharePassword" && (
            <div className="flex flex-col gap-4">
              <input
                type="password"
                className="bg-gray-100 text-gray-800 p-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password to share"
                value={sharedPassword}
                onChange={(e) => setSharedPassword(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                onClick={handleSharePassword}
              >
                Share Password
              </button>
            </div>
          )}
          {activeTab === "shareFiles" && (
            <div className="flex flex-col gap-4">
              <div
                className="bg-gray-100 text-gray-600 p-4 rounded-md shadow-md flex items-center justify-center h-48 cursor-pointer border-2 border-dashed border-gray-300"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="text-center">
                  <p className="font-medium">Drag and drop files here</p>
                  <p className="text-sm text-gray-500">
                    or click to select files
                  </p>
                </div>
              </div>
              <input
                type="file"
                id="fileInput"
                multiple
                className="hidden"
                onChange={handleFilesSelect}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Share Files
              </button>
            </div>
          )}

          {activeTab === "shareFolders" && (
            <div className="flex flex-col gap-4">
              <div
                className="bg-gray-100 text-gray-600 p-4 rounded-md shadow-md flex items-center justify-center h-48 cursor-pointer border-2 border-dashed border-gray-300"
                onClick={() => document.getElementById("folderInput").click()}
              >
                <div className="text-center">
                  <p className="font-medium">Drag and drop folders here</p>
                  <p className="text-sm text-gray-500">
                    or click to select folders
                  </p>
                </div>
              </div>
              <input
                type="file"
                id="folderInput"
                webkitdirectory="true"
                multiple
                className="hidden"
                onChange={handleFoldersSelect}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                onClick={() => document.getElementById("folderInput").click()}
              >
                Share Folders
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-100 p-8 flex-1 mt-8 rounded-b-lg shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold mb-2">Received Messages</h3>
              {receivedMessages.length > 0 ? (
                receivedMessages.map((message, index) => (
                  <div
                    key={index}
                    className="bg-white text-gray-600 p-4 rounded-md shadow-md mb-2 flex justify-between items-center "
                  >
                    <div>
                      {message.type === "text" && <p>{message.content}</p>}
                      {message.type === "password" && (
                        <p>Password: {message.content}</p>
                      )}
                      {message.type === "files" && (
                        <div>
                          <p>Shared Files:</p>
                          <ul className="list-disc pl-4">
                            {Array.isArray(message.content) &&
                              message.content.map((file, fileIndex) => (
                                <li key={fileIndex}>{file.name}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                      {message.type === "folders" && (
                        <div>
                          <p>Shared Folders:</p>
                          <ul className="list-disc pl-4">
                            {Array.isArray(message.content) &&
                              message.content.map((folder, folderIndex) => (
                                <li key={folderIndex}>{folder.name}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          message.type === "text"
                            ? message.content
                            : message.type === "password"
                            ? `Password: ${message.content}`
                            : message.type === "files"
                            ? message.content
                                .map((file) => file.name)
                                .join(", ")
                            : message.type === "folders"
                            ? message.content
                                .map((folder) => folder.name)
                                .join(", ")
                            : ""
                        );
                        toast.success("Copied to clipboard!");
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))
              ) : (
                <p>No messages received yet.</p>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Access Options</h3>
              <div className="flex gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors">
                  Share Text
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors">
                  Share Password
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors">
                  Share Files
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors">
                  Share Folders
                </button>
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
              onClick={() => toast.success("Disconnected")}
            >
              Disconnect
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}

export default Share;
