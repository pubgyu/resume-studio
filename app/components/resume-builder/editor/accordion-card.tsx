"use client";

import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/app/components/ui/accordion";

type AccordionCardProps = {
  action?: ReactNode;
  children: ReactNode;
  description: string;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  title: string;
  value: string;
};

export function AccordionCard({
  action,
  children,
  description,
  isVisible = true,
  onToggleVisibility,
  title,
  value
}: AccordionCardProps) {
  return (
    <AccordionItem className="panel-card accordion-card" value={value}>
      <div className="section-header accordion-header">
        <AccordionTrigger className="accordion-button">
          <span className="accordion-copy">
            <span className="accordion-title-row">
              <span className="accordion-title">{title}</span>
              {onToggleVisibility && !isVisible ? (
                <span className="accordion-hidden-badge">숨김</span>
              ) : null}
            </span>
            <span className="accordion-description">{description}</span>
          </span>
        </AccordionTrigger>

        {onToggleVisibility ? (
          <Button
            aria-label={isVisible ? `${title} 숨기기` : `${title} 보이기`}
            className="accordion-visibility-toggle"
            size="icon"
            title={isVisible ? `${title} 숨기기` : `${title} 보이기`}
            type="button"
            variant="ghost"
            onClick={onToggleVisibility}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </Button>
        ) : null}
      </div>
      <AccordionContent className="accordion-body">
        <div>
          {action ? <div className="accordion-action">{action}</div> : null}
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
