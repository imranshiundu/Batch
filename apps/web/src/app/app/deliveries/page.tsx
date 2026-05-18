"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = React.useState(0);

  const deliveries = [
    {
      batch: "Shenzhen Charger Restock",
      mode: "Hub Pickup",
      status: "AT HUB",
      estimate: "Oct 24, 2026",
      stages: [
        { name: "Cleared", done: true },
        { name: "Production confirmed", done: true },
        { name: "Shipped", done: true },
        { name: "At Hub", done: true, active: true },
        { name: "Delivered", done: false },
      ]
    },
    {
      batch: "Logitech MX Master Bulk",
      mode: "Direct Delivery",
      status: "SHIPPED",
      estimate: "Oct 28, 2026",
      stages: [
        { name: "Cleared", done: true },
        { name: "Production confirmed", done: true },
        { name: "Shipped", done: true, active: true },
        { name: "At Hub", done: false },
        { name: "Delivered", done: false },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <h1 className="text-[24px] font-medium text-ink-primary tracking-tight">Delivery Tracking</h1>

      <div className="flex flex-col lg:flex-row gap-6 h-full items-start">
        
        {/* List Left */}
        <div className="w-full lg:w-[40%] flex flex-col gap-3">
          {deliveries.map((delivery, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDelivery(idx)}
              className={`w-full text-left p-5 border rounded-[12px] transition-all flex flex-col gap-2 ${
                selectedDelivery === idx 
                  ? "border-border-focus bg-semantic-escrowLight shadow-ui" 
                  : "border-border bg-surface hover:bg-surface-raised"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[15px] font-medium text-ink-primary line-clamp-1">{delivery.batch}</span>
                <Badge variant={delivery.status === "AT HUB" ? "success" : "default"}>{delivery.status}</Badge>
              </div>
              <div className="flex items-center justify-between w-full mt-1">
                <span className="text-[13px] text-ink-secondary">{delivery.mode}</span>
                <span className="text-[13px] font-medium text-ink-primary">{delivery.estimate}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel Right */}
        <div className="w-full lg:w-[60%] sticky top-[88px]">
          <div className="bg-surface border border-border rounded-[12px] p-8 flex flex-col min-h-[400px]">
            
            <h2 className="text-[20px] font-medium text-ink-primary mb-2">{deliveries[selectedDelivery].batch}</h2>
            <p className="text-[14px] text-ink-secondary mb-8">Estimated delivery: {deliveries[selectedDelivery].estimate}</p>

            <div className="flex flex-col gap-0 relative ml-2">
              {deliveries[selectedDelivery].stages.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-5 h-16 relative">
                  <div className="flex flex-col items-center h-full">
                    <div className={`w-[16px] h-[16px] rounded-full border-2 bg-surface z-10 flex-shrink-0 ${
                      stage.active ? "border-semantic-escrow bg-semantic-escrowLight animate-pulse" :
                      stage.done ? "border-semantic-cleared bg-semantic-cleared" :
                      "border-border"
                    }`} />
                    {idx !== deliveries[selectedDelivery].stages.length - 1 && (
                      <div className={`w-[2px] h-full absolute top-[16px] bottom-[-16px] ${
                        stage.done ? "bg-semantic-cleared" : "bg-border"
                      }`} />
                    )}
                  </div>
                  <span className={`text-[15px] -mt-[2px] ${
                    stage.active ? "font-medium text-ink-primary" :
                    stage.done ? "text-ink-primary" :
                    "text-ink-secondary"
                  }`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
