// utils/networkScanner.ts
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

export class NetworkScanner {
    private static readonly port = '3001';

    // Pure network discovery - no fallbacks
    static async findServers(): Promise<string[]> {
        console.log('🔍 Starting network discovery...');
        return await this.scanLocal();
    }

    private static async scanLocal(): Promise<string[]> {
        const servers: string[] = [];
          try {
            const netInfo = await NetInfo.fetch();
            const ipAddress = (netInfo.details as any)?.ipAddress;
            
            if (!ipAddress) {
                console.error('No IP address found');
                return servers;
            }

            const baseIP = this.getBaseIP(ipAddress);
            console.log(`📡 Scanning network ${baseIP}x for nutrition servers...`);

            if (!baseIP) {
                console.error('Invalid base IP address');
                return servers;
            }

            // Create scan promises for entire network range
            const scanPromises: Promise<string | null>[] = [];
            for (let i = 1; i <= 254; i++) {
                const targetIP = `${baseIP}${i}`;
                const url = `http://${targetIP}:${this.port}`;
                scanPromises.push(this.testServer(url));
            }

            // Execute all scans in parallel
            const hits = await Promise.allSettled(scanPromises);
            hits.forEach((hit) => {
                if (hit.status === 'fulfilled' && hit.value) {
                    servers.push(hit.value);
                    console.log(`✅ Found nutrition server: ${hit.value}`);
                }
            });

        } catch (error) {
            console.error('Error scanning local network:', error);
        }

        console.log(`🎯 Discovery complete. Found ${servers.length} server(s).`);
        return servers;
    }    private static async testServer(url: string): Promise<string | null> {
        try {
            console.log(`🔍 Testing: ${url}/api/discovery`);
            
            const response = await axios.get(`${url}/api/discovery`, {
                timeout: 5000 // 5 second timeout
            });
        
            console.log(`📡 Response from ${url}: Status ${response.status}`);
                
            if (response.status === 200 && response.data) {
                const responseData = response.data;
                console.log(`📦 Data from ${url}:`, responseData);
                
                // Check for 'Empowerer' in the name field
                if (responseData.name && responseData.name.toLowerCase().includes('empowerer')) {
                    console.log(`✅ VALIDATED server at ${url}`);
                    return url;
                } else {
                    console.log(`❌ REJECTED server at ${url} - name: "${responseData.name}"`);
                }
            }
        } catch (error: any) {
            // Log timeout errors for all servers to help debug network issues
            if (error.code === 'ECONNABORTED') {
                console.log(`⏱️ Timeout testing ${url} (${error.message})`);
            }
            // For other errors, only log if they seem relevant
            else if (error.message && !error.message.includes('ECONNREFUSED')) {
                console.log(`🔌 Network error testing ${url}: ${error.message}`);
            }
        }
                
        return null;
    }

    private static getBaseIP(ip: string): string {
        const parts = ip.split('.');
        if (parts.length < 3) {
            console.error('Invalid IP address format');
            return '';
        }
        return `${parts[0]}.${parts[1]}.${parts[2]}.`;
    }
}