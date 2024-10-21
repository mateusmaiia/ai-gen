import Transaction from '@/models/transactions'
import db from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'

interface CheckoutSessionResponse {
    url?: string;
    error?: string;
}

export async function CreateCheckoutSession():Promise<CheckoutSessionResponse>{
    const user = await currentUser()
    const customerEmail = user?.emailAddresses[0]?.emailAddress

    if(!customerEmail){
        return {error: "User not found"}
    }

    try {
        await db()

        //find the stripe customer id from database
        const existingTransaction = await Transaction.findOne({customerEmail})
        if(existingTransaction){
            //retrive the customer subscription from stripe
            const subscriptions = await stripe.subscriptions.list({
                customer: existingTransaction.customerId,
                status: "all",
                limit: 1,
            });

            //check if any subscription is active
            const currentSubscription = subscriptions.data.find(
                (sub)  => sub.status === "active"
            )

            if(currentSubscription){
                return ({error: 'You already have an active subscription'})
            }
        }
    } catch (error) {
        console.log(error)
        return {error: "Error craeting stripe checkout session"}; 
    }
}