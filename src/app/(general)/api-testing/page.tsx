"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

// Helper function untuk mendapatkan tanggal valid (setidaknya hari ini)
const getValidDate = (daysFromNow: number = 7): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

interface Endpoint {
  method: string;
  path: string;
  description: string;
  requiresAuth: boolean;
  params?: Record<string, string | number>;
  body?: Record<string, unknown>;
  needsIdFromList?: boolean; // Flag untuk endpoint yang perlu ID dari list
}

interface EndpointGroup {
  name: string;
  endpoints: Endpoint[];
}

const endpointGroups: EndpointGroup[] = [
  {
    name: "📋 Kelola Submission Haji",
    endpoints: [
      {
        method: "GET",
        path: "/api/haji/submission",
        description: "List submission haji milik user/mitra yang login",
        requiresAuth: true,
        params: { status: "belum", tglAwal: "", tglAkhir: "" },
      },
      {
        method: "GET",
        path: "/api/haji/submission/{id}",
        description: "Detail submission haji berdasarkan ID",
        requiresAuth: true,
        params: { id: "" }, // Will be filled from list or manual input
        needsIdFromList: true, // Flag to indicate this needs ID from list endpoint
      },
      {
        method: "PUT",
        path: "/api/haji/submission/{id}/update-status",
        description: "Update status submission haji",
        requiresAuth: true,
        params: { id: "" }, // Will be filled from list or manual input
        body: { status_id: 1 },
        needsIdFromList: true,
      },
    ],
  },
  {
    name: "📚 Kelola Submission Edutrip",
    endpoints: [
      {
        method: "GET",
        path: "/api/edutrip/submission",
        description: "List submission edutrip milik user/mitra yang login",
        requiresAuth: true,
        params: { status: "belum", tglAwal: "", tglAkhir: "" },
      },
      {
        method: "GET",
        path: "/api/edutrip/submission/{id}",
        description: "Detail submission edutrip berdasarkan ID",
        requiresAuth: true,
        params: { id: "" },
        needsIdFromList: true,
      },
      {
        method: "PUT",
        path: "/api/edutrip/submission/{id}/update-status",
        description: "Update status submission edutrip",
        requiresAuth: true,
        params: { id: "" },
        body: { status_id: 1 },
        needsIdFromList: true,
      },
    ],
  },
  {
    name: "🌍 Land Arrangement",
    endpoints: [
      {
        method: "POST",
        path: "/api/mitra/land-arrangement/grup",
        description: "Request Land Arrangement untuk grup",
        requiresAuth: true,
        body: {
          nama_lengkap: "Test User",
          no_whatsapp: "08123456789",
          alamat_lengkap: "Jl. Test No. 123",
          jumlah_pax: 50,
          tanggal_keberangkatan: getValidDate(7), // 7 hari dari sekarang
          tanggal_kepulangan: getValidDate(17), // 17 hari dari sekarang
        },
      },
      {
        method: "POST",
        path: "/api/mitra/land-arrangement/private",
        description: "Request Land Arrangement untuk private",
        requiresAuth: true,
        body: {
          nama_lengkap: "Test User",
          no_whatsapp: "08123456789",
          alamat_lengkap: "Jl. Test No. 123",
          jumlah_pax: 2,
          tanggal_keberangkatan: getValidDate(7), // 7 hari dari sekarang
          tanggal_kepulangan: getValidDate(17), // 17 hari dari sekarang
        },
      },
      {
        method: "POST",
        path: "/api/mitra/land-arrangement/pemesanan-reguler",
        description: "Pemesanan Paket Land Arrangement Reguler",
        requiresAuth: true,
        body: {
          nama_lengkap: "Test User",
          no_whatsapp: "08123456789",
          alamat_lengkap: "Jl. Test No. 123",
          paket_la_id: 1,
          jumlah_pax: 10,
          tanggal_keberangkatan: getValidDate(7), // 7 hari dari sekarang
        },
      },
    ],
  },
  {
    name: "📦 Bundling",
    endpoints: [
      {
        method: "POST",
        path: "/api/paket-umrah/pesan-bundling-edutrip",
        description: "Pemesanan Paket Umrah + Edutrip (Bundling)",
        requiresAuth: true,
        body: {
          nama_lengkap: "Test User",
          no_whatsapp: "08123456789",
          alamat_lengkap: "Jl. Test No. 123",
          paket_umrah_id: 1,
          paket_edutrip_id: 1,
          tanggal_keberangkatan_umrah: getValidDate(7), // 7 hari dari sekarang
          tanggal_kunjungan_edutrip: getValidDate(12), // 12 hari dari sekarang
          jumlah_pax: 10,
        },
      },
      {
        method: "POST",
        path: "/api/mitra/haji/submit-form",
        description: "Handle Submission Form Haji untuk Mitra",
        requiresAuth: true,
        body: {
          nama_lengkap: "Test User",
          no_whatsapp: "08123456789",
          alamat_lengkap: "Jl. Test No. 123",
          produk_id: 1,
        },
      },
    ],
  },
];

interface TestResult {
  status: "pending" | "success" | "error";
  statusCode?: number;
  responseTime?: number;
  response?: unknown;
  error?: string;
}

export default function ApiTestingPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState(
    process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000"
  );
  const [manualToken, setManualToken] = useState("");
  const [useManualToken, setUseManualToken] = useState(false);
  const [tokenFromServer, setTokenFromServer] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [availableIds, setAvailableIds] = useState<{
    haji: number[];
    edutrip: number[];
  }>({ haji: [], edutrip: [] });

  // Get token from server via API route
  const fetchToken = async () => {
    try {
      const response = await fetch("/api/auth/token");
      const data = await response.json();
      setTokenFromServer(data.token);
      return data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      setTokenFromServer(null);
      return null;
    }
  };

  useEffect(() => {
    if (!useManualToken) {
      fetchToken();
    }
  }, [useManualToken]);

  const currentToken = useManualToken ? manualToken : tokenFromServer;

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-500";
      case "POST":
        return "bg-blue-500";
      case "PUT":
        return "bg-yellow-500";
      case "DELETE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const testEndpoint = async (endpoint: Endpoint, groupIndex: number, endpointIndex: number) => {
    const key = `${groupIndex}-${endpointIndex}`;
    setTesting((prev) => ({ ...prev, [key]: true }));
    setResults((prev) => ({
      ...prev,
      [key]: { status: "pending" },
    }));

    const startTime = Date.now();

    try {
      // Get fresh token if not using manual token
      let token = currentToken;
      if (!useManualToken && !token) {
        try {
          const tokenResponse = await fetch("/api/auth/token");
          const tokenData = await tokenResponse.json();
          token = tokenData.token;
        } catch {
          // Ignore error, will be handled below
        }
      }

      let url = apiBaseUrl + endpoint.path;

      // Handle endpoints that need ID from list
      if (endpoint.needsIdFromList && endpoint.params?.id === "") {
        // Try to get ID from available IDs
        let idToUse: number | null = null;
        
        if (endpoint.path.includes("/haji/submission")) {
          idToUse = availableIds.haji.length > 0 ? availableIds.haji[0] : null;
        } else if (endpoint.path.includes("/edutrip/submission")) {
          idToUse = availableIds.edutrip.length > 0 ? availableIds.edutrip[0] : null;
        }
        
        if (!idToUse) {
          // Try to fetch list first to get available IDs
          try {
            const listUrl = endpoint.path.includes("/haji/") 
              ? apiBaseUrl + "/api/haji/submission"
              : apiBaseUrl + "/api/edutrip/submission";
            
            const listResponse = await fetch(listUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });
            
            if (listResponse.ok) {
              const listData = await listResponse.json();
              if (listData.data && Array.isArray(listData.data) && listData.data.length > 0) {
                idToUse = listData.data[0].id;
                // Update available IDs
                if (endpoint.path.includes("/haji/")) {
                  setAvailableIds(prev => ({ ...prev, haji: listData.data.map((item: { id: number }) => item.id) }));
                } else {
                  setAvailableIds(prev => ({ ...prev, edutrip: listData.data.map((item: { id: number }) => item.id) }));
                }
              }
            }
          } catch {
            // Ignore, will show error below
          }
        }
        
        if (!idToUse) {
          const endpointType = endpoint.path.includes("/haji/") ? "haji" : "edutrip";
          setResults((prev) => ({
            ...prev,
            [key]: {
              status: "error",
              statusCode: 400,
              responseTime: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
              error: "ID tidak tersedia",
              response: {
                success: false,
                message: `Tidak ada data submission ${endpointType} yang tersedia.`,
                hint: `Silakan buat submission terlebih dahulu dengan test endpoint POST /api/mitra/${endpointType}/submit-form atau pastikan Anda sudah memiliki submission yang dibuat sebelumnya. Setelah itu, test endpoint GET /api/${endpointType}/submission untuk mendapatkan ID yang valid.`
              },
            },
          }));
          setTesting((prev) => ({ ...prev, [key]: false }));
          return;
        }
        
        // Update params with found ID
        endpoint.params = { ...endpoint.params, id: idToUse };
      }

      // Replace path parameters
      let hasInvalidParam = false;
      if (endpoint.params) {
        for (const key of Object.keys(endpoint.params)) {
          if (endpoint.path.includes(`{${key}}`)) {
            const paramValue = endpoint.params![key];
            if (paramValue === "" || paramValue === null || paramValue === undefined) {
              setResults((prev) => ({
                ...prev,
                [key]: {
                  status: "error",
                  statusCode: 400,
                  responseTime: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
                  error: "Parameter tidak valid",
                  response: {
                    success: false,
                    message: `Parameter ${key} tidak boleh kosong. Silakan test endpoint list terlebih dahulu untuk mendapatkan ID yang valid.`
                  },
                },
              }));
              setTesting((prev) => ({ ...prev, [key]: false }));
              hasInvalidParam = true;
              break;
            }
            url = url.replace(`{${key}}`, String(paramValue));
          }
        }
      }
      
      if (hasInvalidParam) {
        return;
      }

      // Add query parameters for GET requests
      if (endpoint.method === "GET" && endpoint.params) {
        const queryParams = new URLSearchParams();
        Object.keys(endpoint.params).forEach((paramKey) => {
          if (!endpoint.path.includes(`{${paramKey}}`) && endpoint.params![paramKey]) {
            queryParams.append(paramKey, String(endpoint.params![paramKey]));
          }
        });
        if (queryParams.toString()) {
          url += "?" + queryParams.toString();
        }
      }

      const config: {
        method: string;
        headers: Record<string, string>;
        data?: Record<string, unknown>;
      } = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      if (endpoint.requiresAuth) {
        if (!token) {
          setResults((prev) => ({
            ...prev,
            [key]: {
              status: "error",
              statusCode: 401,
              responseTime: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
              error: "No token found",
              response: { 
                success: false, 
                message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
                hint: "Token diambil dari cookie 'kaffah_token'. Pastikan Anda sudah login."
              },
            },
          }));
          setTesting((prev) => ({ ...prev, [key]: false }));
          return;
        }
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (endpoint.body && (endpoint.method === "POST" || endpoint.method === "PUT")) {
        config.data = endpoint.body;
      }

      // Use fetch instead of apiInstance to have more control
      const response = await fetch(url, {
        method: endpoint.method,
        headers: config.headers,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined,
      });

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      let responseData;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch {
        responseData = { error: "Failed to parse response" };
      }

      if (response.ok) {
        // If this is a list endpoint, extract IDs for future use
        if (endpoint.path === "/api/haji/submission" && Array.isArray(responseData?.data)) {
          setAvailableIds(prev => ({
            ...prev,
            haji: (responseData as { data: { id: number }[] }).data.map((item) => item.id).filter((id) => id)
          }));
        } else if (endpoint.path === "/api/edutrip/submission" && Array.isArray(responseData?.data)) {
          setAvailableIds(prev => ({
            ...prev,
            edutrip: (responseData as { data: { id: number }[] }).data.map((item) => item.id).filter((id) => id)
          }));
        }
        
        setResults((prev) => ({
          ...prev,
          [key]: {
            status: "success",
            statusCode: response.status,
            responseTime: parseFloat(duration),
            response: responseData,
          },
        }));
      } else {
        setResults((prev) => ({
          ...prev,
          [key]: {
            status: "error",
            statusCode: response.status,
            responseTime: parseFloat(duration),
            error: `HTTP ${response.status}`,
            response: responseData,
          },
        }));
      }
    } catch (error: unknown) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      const message = error instanceof Error ? error.message : "Network Error";

      setResults((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          statusCode: undefined,
          responseTime: parseFloat(duration),
          error: message,
          response: { error: message },
        },
      }));
    } finally {
      setTesting((prev) => ({ ...prev, [key]: false }));
    }
  };

  const testAllEndpoints = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin test semua endpoint? Ini mungkin memakan waktu beberapa saat."
      )
    ) {
      return;
    }

    for (let groupIndex = 0; groupIndex < endpointGroups.length; groupIndex++) {
      const group = endpointGroups[groupIndex];
      for (let endpointIndex = 0; endpointIndex < group.endpoints.length; endpointIndex++) {
        await testEndpoint(group.endpoints[endpointIndex], groupIndex, endpointIndex);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay antar request
      }
    }
  };

  const stats = {
    total: endpointGroups.reduce((sum, group) => sum + group.endpoints.length, 0),
    tested: Object.keys(results).length,
    success: Object.values(results).filter((r) => r.status === "success").length,
    failed: Object.values(results).filter((r) => r.status === "error").length,
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">🔍 API Testing Dashboard</h1>
        <p className="text-purple-100">Kroscek & Test Semua Endpoint Kaffah Backend</p>
      </div>

      {/* Config Section */}
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Base URL:</label>
            <Input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useManualToken"
                checked={useManualToken}
                onChange={(e) => setUseManualToken(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="useManualToken" className="text-sm font-medium">
                Gunakan Token Manual (jika cookie tidak tersedia)
              </label>
            </div>
            {useManualToken && (
              <Input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Masukkan Bearer Token manual"
                className="mt-2"
              />
            )}
          </div>

          <div className={`border rounded-lg p-4 ${
            currentToken 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-start gap-2">
              {currentToken ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="text-sm flex-1">
                <strong className={currentToken ? "text-green-800" : "text-red-800"}>
                  Status Token:
                </strong>
                <span className={currentToken ? "text-green-700 ml-2" : "text-red-700 ml-2"}>
                  {currentToken 
                    ? `✅ Token ditemukan (${currentToken.substring(0, 20)}...)` 
                    : "❌ Token tidak ditemukan"}
                </span>
                {!currentToken && (
                  <div className="mt-2 space-y-2">
                    <div className="text-red-700">
                      Silakan login terlebih dahulu di{" "}
                      <a href="/login" target="_blank" className="underline font-medium text-blue-600 hover:text-blue-800">
                        halaman login
                      </a>
                      {" "}atau masukkan token manual di atas.
                    </div>
                    <Button
                      onClick={async () => {
                        const token = await fetchToken();
                        if (token) {
                          alert("✅ Token berhasil diambil!");
                        } else {
                          alert("❌ Token tidak ditemukan. Silakan login terlebih dahulu.");
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="mt-2"
                    >
                      🔄 Refresh Token
                    </Button>
                    <div className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2">
                      <strong>Cara mendapatkan token:</strong>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Login di <a href="/login" target="_blank" className="underline">/login</a></li>
                        <li>Setelah login, klik tombol &quot;🔄 Refresh Token&quot; di atas</li>
                        <li>Atau refresh halaman ini (F5)</li>
                        <li>Atau copy token dari response login dan paste di field &quot;Token Manual&quot;</li>
                      </ol>
                    </div>
                  </div>
                )}
                {currentToken && (
                  <Button
                    onClick={fetchToken}
                    size="sm"
                    variant="outline"
                    className="mt-2"
                  >
                    🔄 Refresh Token
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Ringkasan Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-700">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total Endpoint</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">{stats.tested}</div>
              <div className="text-sm text-blue-600 mt-1">Sudah Ditest</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700">{stats.success}</div>
              <div className="text-sm text-green-600 mt-1">Berhasil</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-700">{stats.failed}</div>
              <div className="text-sm text-red-600 mt-1">Gagal</div>
            </div>
          </div>
          <Button onClick={testAllEndpoints} className="w-full" size="lg">
            🚀 Test Semua Endpoint
          </Button>
        </CardContent>
      </Card>

      {/* Endpoints */}
      {endpointGroups.map((group, groupIndex) => (
        <Card key={groupIndex}>
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.endpoints.map((endpoint, endpointIndex) => {
              const key = `${groupIndex}-${endpointIndex}`;
              const result = results[key];
              const isTesting = testing[key];

              return (
                <div
                  key={endpointIndex}
                  className="border rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                  {endpoint.needsIdFromList && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      <strong>💡 Tips:</strong> Endpoint ini memerlukan ID. Sistem akan otomatis mengambil ID dari hasil endpoint list. 
                      Pastikan test endpoint list terlebih dahulu untuk mendapatkan ID yang valid.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => testEndpoint(endpoint, groupIndex, endpointIndex)}
                      disabled={isTesting}
                      size="sm"
                      variant="default"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        "🧪 Test Endpoint"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        const detailText = `Method: ${endpoint.method}\nPath: ${endpoint.path}\nDescription: ${endpoint.description}\nRequires Auth: ${endpoint.requiresAuth}\n\nParams: ${JSON.stringify(endpoint.params || {}, null, 2)}\n\nBody: ${JSON.stringify(endpoint.body || {}, null, 2)}${endpoint.needsIdFromList ? '\n\n⚠️ Endpoint ini memerlukan ID. ID akan diambil otomatis dari endpoint list.' : ''}`;
                        alert(detailText);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      📝 Lihat Detail
                    </Button>
                  </div>

                  {result && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.status === "success" && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {result.status === "error" && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          {result.status === "pending" && (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                          <span
                            className={`font-semibold ${
                              result.status === "success"
                                ? "text-green-700"
                                : result.status === "error"
                                  ? "text-red-700"
                                  : "text-yellow-700"
                            }`}
                          >
                            {result.status === "success"
                              ? `✅ Success (${result.statusCode})`
                              : result.status === "error"
                                ? `❌ Error (${result.statusCode || "Network Error"})`
                                : "⏳ Pending"}
                          </span>
                        </div>
                        {result.responseTime && (
                          <span className="text-sm text-gray-500">
                            ⏱️ {result.responseTime}s
                          </span>
                        )}
                      </div>
                      <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                        {JSON.stringify(result.response || result.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
