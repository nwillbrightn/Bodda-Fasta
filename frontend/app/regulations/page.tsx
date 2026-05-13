"use client";

import { useState, useEffect, useRef } from "react";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `By accessing or using the BodaBoda platform, you agree to be bound by these Service Regulations, our Privacy Policy, and all applicable laws. If you do not agree with any part of these terms, you must discontinue use immediately. These regulations apply to all users including customers, riders, and administrators.`,
  },
  {
    id: "eligibility",
    title: "Eligibility & Accounts",
    rules: [
      "You must be at least 18 years of age to register an account.",
      "You must provide accurate, current, and complete information during registration.",
      "Each individual may only maintain one active account on the Platform.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "Accounts created using false information will be permanently suspended without notice.",
    ],
  },
  {
    id: "riders",
    title: "Rider Requirements",
    rules: [
      "All riders must possess a valid motorcycle operator's license issued by the relevant authority.",
      "Riders must register their motorcycle with a plate number beginning with the prefix 'MC'.",
      "Riders must maintain valid vehicle registration, insurance, and roadworthiness certificates.",
      "Riders must ensure their motorcycle is in safe operating condition before each trip.",
      "Riders must wear a helmet and provide one for passengers on every trip.",
      "Riders must maintain accurate availability status and real-time GPS location while on duty.",
      "Riders must not operate while under the influence of alcohol or any substance.",
    ],
  },
  {
    id: "customers",
    title: "Customer Obligations",
    rules: [
      "Customers must provide accurate pickup and drop-off location information.",
      "Customers must be ready at the pickup location within a reasonable time after confirmation.",
      "Customers must treat riders with respect and professionalism at all times.",
      "Customers must not request trips for illegal purposes or to transport prohibited items.",
      "Customers must wear a helmet provided by the rider during every trip.",
      "Customers are responsible for any damage caused to the rider's vehicle through negligence.",
    ],
  },
  {
    id: "prohibited",
    title: "Prohibited Conduct",
    rules: [
      "Abusive, threatening, discriminatory, or harassing behavior toward any user or rider.",
      "Any attempt to manipulate the Platform's pricing, matching, or rating systems.",
      "Creating fake accounts, reviews, or ratings.",
      "Sharing account credentials or allowing third parties to use your account.",
      "Soliciting off-platform payments that bypass the Platform's systems.",
      "Using the Platform to facilitate any illegal activities.",
      "Unauthorized data scraping, hacking, or reverse engineering of the Platform.",
    ],
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    rules: [
      "All payments must be processed exclusively through the Platform's payment system.",
      "Prices are calculated based on distance, time, demand, and applicable surge pricing.",
      "Riders receive their fare share after platform fees as outlined in their rider agreement.",
      "Off-platform cash arrangements that bypass the system are strictly prohibited.",
      "Disputed charges must be reported within 24 hours of the completed trip.",
      "Refunds are processed within 5–10 business days subject to investigation.",
      "Promotional codes and discounts cannot be combined unless explicitly stated.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation Policy",
    rules: [
      "Customers may cancel a ride request before a rider accepts without penalty.",
      "Cancellations after a rider has accepted and is en route may incur a fee.",
      "Riders who cancel after accepting without valid reason receive a penalty strike.",
      "Three or more unjustified rider cancellations within 30 days may result in suspension.",
      "Force majeure events such as natural disasters are exempt from cancellation penalties.",
    ],
  },
  {
    id: "ratings",
    title: "Ratings & Reviews",
    rules: [
      "Both customers and riders are encouraged to provide honest and fair ratings after each trip.",
      "Riders with an average rating below 2.5 over 30 days may be suspended pending review.",
      "Fake, coerced, or retaliatory reviews violate Platform policy and will be removed.",
      "Reviews containing hate speech or defamatory content will be removed immediately.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    rules: [
      "The Platform collects personal data including name, email, phone number, and location.",
      "Data is stored securely and access is restricted to authorized personnel only.",
      "We do not sell or share personal information with third parties without your consent.",
      "Users may request deletion of their account and associated data at any time.",
      "Location tracking is required during active trips and ceases at trip conclusion.",
      "By using the Platform you consent to data collection as described in this policy.",
    ],
  },
  {
    id: "safety",
    title: "Safety & Insurance",
    rules: [
      "Riders are required to carry third-party liability insurance as mandated by local law.",
      "The Platform is not an insurer and does not provide coverage for accidents or losses.",
      "Accidents must be reported to the Platform within 2 hours of the incident.",
      "Riders must not overload their motorcycle beyond its rated capacity.",
      "The Platform cooperates fully with law enforcement investigations.",
    ],
  },
  {
    id: "disputes",
    title: "Disputes & Resolution",
    rules: [
      "All disputes must first be submitted through the Platform's support channel.",
      "The Platform will investigate disputes within 5 business days.",
      "Disputed fares will be held in escrow during the investigation period.",
      "The Platform's decision on disputes is final unless successfully appealed.",
      "Legal action may only be pursued after all internal processes are exhausted.",
    ],
  },
  {
    id: "termination",
    title: "Suspension & Termination",
    rules: [
      "The Platform reserves the right to suspend or terminate any account that violates these regulations.",
      "Suspensions may be temporary (7–30 days) or permanent depending on severity.",
      "Users will be notified of suspension via email with the reason and appeal process.",
      "Appeals must be submitted within 7 days of the suspension notice.",
      "Accounts involved in fraudulent activity will be permanently terminated.",
    ],
  },
  {
    id: "governing",
    title: "Governing Law",
    content: `These regulations are governed by and construed in accordance with the laws of the United Republic of Tanzania. Any legal proceedings arising from or related to these regulations shall be subject to the exclusive jurisdiction of the courts of Tanzania. If any provision is found to be unenforceable, the remaining provisions continue in full force and effect.`,
  },
];

export default function ServiceRegulationsPage() {
  const [active, setActive] = useState<string>(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const el = sectionRefs.current[section.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(section.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#f5f5f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    }}>

      {/* Hero */}
      <div style={{
        padding: "140px 24px 80px",
        textAlign: "center",
        borderBottom: "1px solid #111",
      }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#444",
          marginBottom: 16,
        }}>
          Legal · Last updated April 2026
        </p>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "#fff",
          margin: "0 auto",
          maxWidth: 700,
        }}>
          Service Regulations.
        </h1>
        <p style={{
          fontSize: 17,
          color: "#555",
          lineHeight: 1.6,
          maxWidth: 480,
          margin: "20px auto 0",
        }}>
          The rules and policies that govern the BodaBoda platform.
          Read carefully before using the service.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 48,
          marginTop: 52,
        }}>
          {[
            { value: "13", label: "Sections" },
            { value: "v1.0", label: "Version" },
            { value: "TZ", label: "Jurisdiction" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#444", letterSpacing: "0.05em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "72px 24px 120px",
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 72,
        alignItems: "start",
      }}>

        {/* Sticky sidebar */}
        <div style={{ position: "sticky", top: 88 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#333",
            marginBottom: 14,
            paddingLeft: 10,
          }}>
            Contents
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                  <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  style={{
                    fontSize: 13,
                    color: isActive ? "#fff" : "#444",
                    textDecoration: "none",
                    padding: "7px 10px",
                    borderRadius: 6,
                    background: isActive ? "#111" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    transition: "color 0.2s, background 0.2s",
                    borderLeft: isActive ? "2px solid #fff" : "2px solid transparent",
                  }}
                >
                  {s.title}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }}
            >
              {/* Section header — no number */}
              <h2 style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 20px",
                letterSpacing: "-0.02em",
                paddingBottom: 16,
                borderBottom: "1px solid #111",
              }}>
                {section.title}
              </h2>

              {"content" in section ? (
                <p style={{
                  fontSize: 15,
                  color: "#666",
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  {section.content}
                </p>
              ) : (
                <div>
                  {section.rules!.map((rule, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: 20,
                        padding: "16px 0",
                        borderBottom: j < section.rules!.length - 1
                          ? "1px solid #0f0f0f"
                          : "none",
                      }}
                    >
                      <span style={{
                        fontSize: 11,
                        color: "#2a2a2a",
                        fontWeight: 700,
                        marginTop: 3,
                        flexShrink: 0,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "0.05em",
                      }}>
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <p style={{
                        margin: 0,
                        fontSize: 15,
                        color: "#666",
                        lineHeight: 1.75,
                      }}>
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div style={{
            borderTop: "1px solid #111",
            paddingTop: 40,
          }}>
            <p style={{
              fontSize: 13,
              color: "#333",
              lineHeight: 1.7,
              margin: 0,
            }}>
              These regulations are subject to change. Continued use of the platform
              after any updates constitutes your acceptance of the revised terms.
              For questions, contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}