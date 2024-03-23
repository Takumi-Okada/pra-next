import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request, response: Response) {
    const { sessionId } = await request.json();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    try {
        const existingPurchase = await prisma.purchase.findFirst({
            where: {
              userId: session.client_reference_id!,
              bookId: session.metadata?.bookId!,
            },
        });

        // 既に購入履歴が存在する場合は、新たに作成しない
        if (!existingPurchase) {
            const purchase = await prisma.purchase.create({
            data: {
                userId: session.client_reference_id!,
                bookId: session.metadata?.bookId!,
            },
            });
            return NextResponse.json({ purchase });
        } else {
            // 既に購入履歴が存在する場合の処理
            return NextResponse.json({ message: "Purchase already recorded" });
        }
  
    } catch (err: any) {
        return NextResponse.json({ message: err.message });
    }
}