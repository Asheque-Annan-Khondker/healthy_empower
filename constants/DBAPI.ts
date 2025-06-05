import AsyncStorage from "@react-native-async-storage/async-storage";
import { NetworkScanner } from "@/utils/networkScanner";
import NetInfo from '@react-native-community/netinfo';

export class APIConfiguration{
    private static currentURL: string = 'http://10.0.2.2:3001' // fallback or emulator is using this
    private static isInitialized: boolean = false;
    private static initPromise: Promise<string> | null = null;
    private static lastNetworkIP: string | null = null;
    private static networkListener: any = null;
    
    static async init(): Promise<string>{
        // Return existing promise if already initializing
        if (this.initPromise) {
            return this.initPromise;
        }
        
        // Create and store the initialization promise
        this.initPromise = this.doInit();
        return this.initPromise;
    }
    
    private static async doInit(): Promise<string>{
        // Set up network change listener
        this.setupNetworkListener();
        
        // Check current network IP
        const netInfo = await NetInfo.fetch();
        const currentIP = (netInfo.details as any)?.ipAddress;
        
        // Check if we need to rescan due to network change
        const storedURL = await AsyncStorage.getItem('API_URL');
        const storedNetworkIP = await AsyncStorage.getItem('LAST_NETWORK_IP');
        
        console.log(`🌐 Current network IP: ${currentIP}`);
        console.log(`💾 Stored network IP: ${storedNetworkIP}`);
        console.log(`🔗 Stored API URL: ${storedURL}`);
        
        // If network changed or no stored URL, rescan
        if (!storedURL || !currentIP || currentIP !== storedNetworkIP) {
            console.log('🔄 Network changed or no cached URL - rescanning...');
            return await this.rescanAndUpdate(currentIP);
        }
        
        // Use cached URL
        this.currentURL = storedURL;
        this.lastNetworkIP = currentIP;
        this.isInitialized = true;
        console.log(`✅ Using cached API URL: ${this.currentURL}`);
        return this.currentURL;
    }
    
    private static async rescanAndUpdate(currentIP: string | null): Promise<string> {
        try {
            // Scan for servers
            const servers = await NetworkScanner.findServers();
            if (servers.length > 0) {
                this.currentURL = servers[0]; // use the first found server
                await AsyncStorage.setItem('API_URL', this.currentURL);
                if (currentIP) {
                    await AsyncStorage.setItem('LAST_NETWORK_IP', currentIP);
                    this.lastNetworkIP = currentIP;
                }
                console.log(`🎯 API URL updated to: ${this.currentURL}`);
            } else {
                console.warn('⚠️ No servers found, keeping fallback URL');
            }
            this.isInitialized = true;
        } catch (error) {
            console.error('Error during rescan:', error);
            this.isInitialized = true; // Mark as initialized even on error to prevent hanging
        }
        return this.currentURL;
    }
    
    private static setupNetworkListener() {
        if (this.networkListener) return; // Already set up
        
        this.networkListener = NetInfo.addEventListener(async (state) => {
            const currentIP = (state.details as any)?.ipAddress;
            
            // If we have an IP and it's different from the last known IP
            if (currentIP && this.lastNetworkIP && currentIP !== this.lastNetworkIP) {
                console.log(`🔄 Network change detected: ${this.lastNetworkIP} → ${currentIP}`);
                
                // Reset initialization state to force rescan
                this.isInitialized = false;
                this.initPromise = null;
                
                // Trigger a new scan
                await this.init();
            }
        });
    }
    
    static async getURL(): Promise<string> {
        // Wait for initialization if not done yet
        if (!this.isInitialized) {
            await this.init();
        }
        return this.currentURL;
    }
    
    // Method to manually trigger a rescan (useful for debugging)
    static async forceRescan(): Promise<string> {
        console.log('🔄 Force rescanning network...');
        this.isInitialized = false;
        this.initPromise = null;
        return await this.init();
    }
}

// Export API_URL as a function that always returns the current URL
export const API_URL = () => APIConfiguration.getURL();