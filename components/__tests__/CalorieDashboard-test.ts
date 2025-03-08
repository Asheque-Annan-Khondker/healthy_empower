import CalorieDashboard from "../diet/CalorieDashboard";
import { getDatabase } from "@/utils/database";
import {render, waitFor} from '@testing-library/react-native'

// Moke db module
jest.mock('../diet/CalorieDashboard', ()=>{
    getDatabase: jest.fn()
})

describe('Calorie Dashboard Component', () =>{
    it('displays food properly', async ()=>{
        //mock response
        const mockDB = {
            getAllAsync: jest.fn()
            .mockResolvedValue([{id: 1, name: 'Chicken Salad', calories: 350}])()
        };
        (getDatabase as jest.Mock).mockResolvedValue(mockDB)
        const {getByText} = render(<CalorieDashboard/>)

        await waitFor(()=>{
            expect(getByText('Chicken Salad')).toBeTruthy()
            expect(getByText('350 calories')).toBeTruthy()
        })
    })
})