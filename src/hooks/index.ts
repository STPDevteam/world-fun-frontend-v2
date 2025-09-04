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