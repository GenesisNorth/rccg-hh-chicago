"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight, Shield, Church, Building, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GivePage() {
  const tithelyLink = "https://tithe.ly/give?c=1323289";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-12 md:pt-24 pb-16">
        
        {/* === Typography Hero === */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 md:mb-32 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h4 className="text-[#16A34A] font-bold tracking-widest text-sm uppercase mb-4">
              Worship Through Giving
            </h4>
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Partner With Us.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your generosity makes a difference in our church, our community, and the world. 
              Securely give your tithes and offerings online via Tithe.ly.
            </p>
          </motion.div>
        </section>

        {/* === Main Giving Section === */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Left side: Premium Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-[3rem] p-10 md:p-14 shadow-2xl border border-border flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-[#16A34A]/10 rounded-full flex items-center justify-center mb-8">
                <Heart className="h-10 w-10 text-[#16A34A]" />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Give Online Securely</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                We have partnered with Tithe.ly to provide you with a safe, fast, and easy way to give. 
                You can give a one-time gift or set up recurring donations.
              </p>
              
              <a href={tithelyLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full h-16 rounded-full bg-[#111827] hover:bg-[#16A34A] text-white text-lg font-bold shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center">
                  Give via Tithe.ly <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </a>

              <div className="mt-6 flex items-center text-sm text-muted-foreground justify-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                <p>All transactions are secure and encrypted</p>
              </div>
            </motion.div>

            {/* Right side: Ways to Give */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6 px-4">Ways Your Gift Makes an Impact</h3>
              
              {[
                { icon: Church, title: "Tithe", desc: "Honoring God with the firstfruits of all our increase." },
                { icon: Heart, title: "Offering", desc: "General giving to support the day-to-day operations of the church." },
                { icon: Building, title: "Building Project", desc: "Contributions dedicated towards our church facility development." },
                { icon: Gift, title: "Ministry Support", desc: "Supporting specific outreaches, youth, and children's ministries." }
              ].map((item, i) => (
                <div key={i} className="flex items-start bg-muted/50 p-6 rounded-3xl border border-border/50 hover:border-[#16A34A]/30 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 mr-5">
                    <item.icon className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

          </div>
        </section>

      </main>
    </div>
  );
}