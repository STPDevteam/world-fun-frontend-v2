import { useCallback, useEffect, useState } from 'react'
import { API_URL, BASE_URL } from '../constants'
import { post, get, put } from '../utils/request';

export function useWorldData(address: string|undefined, id: string, refresh: number) {
    const [data, setData] = useState<any>({});
    const fetchData = useCallback(async () => {
        get(`${API_URL}/launch/${id}`, {method: 'GET', headers: {Address: address}}).then((response: any) => {
            setData(response)
        })
    },[id, address])

    useEffect(() => {
        if(id){
            fetchData()
        }
    }, [id, address, refresh])
    return data
} 

export function useBaseUserInfo(address: string | undefined) {
    const [data, setData] = useState<any>({});
    const fetchData = useCallback(async () => {
        post(`${BASE_URL}/api/wallet/login`, {walletAddress: address}).then((response: any) => {
            setData(response.user)
        })
    },[address])

    useEffect(() => {
        if(address){
            fetchData()
        }
    }, [address])
    return data
}

export function useUserInfo(address: string | undefined) {
    const [data, setData] = useState<any>({});
    const fetchData = useCallback(async () => {
        get(`${API_URL}/user`, {method: 'GET', headers: {Address: address}}).then((response: any) => {
            setData(response)
        })
    },[address])

    useEffect(() => {
        if(address){
            fetchData()
        }
    }, [address])
    return data
}

export function useWorldDetail(id: string | undefined) {
    const [data, setData] = useState<any>({});
    const fetchData = useCallback(async () => {
        get(`${API_URL}/worlds/${id}`).then((response: any) => {
            setData(response)
        })
    },[id])

    useEffect(() => {
        if(id){
            fetchData()
        }
    }, [id])
    return data
}

export function useTokensSearch(page: number = 1, limit: number = 100) {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const fetchData = useCallback(async () => {
        setLoading(true);
        get(`https://awe-be-production.up.railway.app/tokens/search?page=${page}&limit=${limit}`).then((response: any) => {
            setData(response);
            setLoading(false);
        }).catch((error: any) => {
            console.error('Failed to fetch tokens:', error);
            setLoading(false);
        });
    }, [page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return { data, loading, refetch: fetchData };
}

export function useAgents() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const STORAGE_KEY = 'agents_list';
    
    const fetchData = useCallback(async () => {
        
        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                setData(parsedData || []);
                setLoading(false);
                return; 
            } catch (error) {
                console.error('Failed to parse cached agents data:', error);
                
            }
        }
        
        
        setLoading(true);
        get('https://awe.stp.network/agents').then((response: any) => {
            const agentsData = response || [];
            setData(agentsData);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(agentsData));
            setLoading(false);
        }).catch((error: any) => {
            console.error('Failed to fetch agents:', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return { data, loading, refetch: fetchData };
}