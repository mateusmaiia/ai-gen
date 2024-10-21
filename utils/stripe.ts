import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if(!secretKey){
    throw new Error("Stripe secret ket not provided")
}

const stripe = new Stripe(secretKey, {
    apiVersion: "2024-09-30.acacia"
})

export default stripe