import path from "node:path";
import React from "react";
import { Document, Font, Link, Page, renderToFile, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  resumeIdentity,
  resumeJobs,
  resumeReferences,
  resumeSkillGroups,
  resumeSummary,
} from "../src/lib/resume-public";

const fonts = path.join(process.cwd(), "src/fonts");

Font.register({ family: "Newsreader", src: path.join(fonts, "Newsreader-500.ttf") });
Font.register({ family: "Source Sans 3", src: path.join(fonts, "SourceSans3-400.ttf") });
Font.register({ family: "IBM Plex Mono", src: path.join(fonts, "IBMPlexMono-500.ttf") });
// Subset of Liberation Sans (SIL OFL) for the arrow, which the site fonts do not include.
Font.register({ family: "Arrow", src: path.join(fonts, "Arrow-Regular.ttf") });
Font.registerHyphenationCallback((word) => [word]);

const ink = "#1c1915";
const muted = "#5c564c";
const line = "#d9d3c7";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 44,
    fontFamily: "Source Sans 3",
    fontSize: 9.5,
    color: ink,
    lineHeight: 1.28,
  },
  name: {
    fontFamily: "Newsreader",
    fontSize: 22,
    letterSpacing: -0.2,
    lineHeight: 1.1,
  },
  contact: {
    marginTop: 6,
    color: muted,
    fontSize: 9,
    lineHeight: 1.35,
  },
  contactLink: {
    color: muted,
    textDecoration: "none",
  },
  rule: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: line,
  },
  section: {
    marginTop: 6,
  },
  sectionLabel: {
    fontFamily: "IBM Plex Mono",
    fontSize: 8,
    letterSpacing: 1.4,
    color: muted,
    marginBottom: 4,
  },
  summary: {
    fontSize: 9.5,
    lineHeight: 1.3,
  },
  job: {
    marginBottom: 6,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  role: {
    fontFamily: "Newsreader",
    fontSize: 12,
    lineHeight: 1.2,
    flex: 1,
  },
  arrow: {
    fontFamily: "Arrow",
    fontSize: 12,
  },
  dates: {
    fontFamily: "IBM Plex Mono",
    fontSize: 8,
    color: muted,
    marginTop: 2,
  },
  org: {
    marginTop: 1,
    color: muted,
    fontSize: 9.5,
  },
  bullet: {
    flexDirection: "row",
    marginTop: 1,
    paddingRight: 4,
  },
  mark: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.28,
  },
  projectsLabel: {
    marginTop: 2,
    fontFamily: "IBM Plex Mono",
    fontSize: 8,
    letterSpacing: 0.6,
    color: muted,
  },
  skill: {
    marginTop: 1,
    fontSize: 9.5,
    lineHeight: 1.28,
  },
  skillName: {
    fontFamily: "IBM Plex Mono",
    fontSize: 8,
    color: muted,
  },
});

function RichText({ children, style }: { children: string; style?: Style }) {
  const parts = children.split("→");
  if (parts.length === 1) return <Text style={style}>{children}</Text>;
  return (
    <Text style={style}>
      {parts.map((part, index) => (
        <Text key={`${part}-${index}`}>
          {index > 0 ? <Text style={styles.arrow}>→</Text> : null}
          {part}
        </Text>
      ))}
    </Text>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bullet} wrap={false}>
      <Text style={styles.mark}>–</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function ResumeDocument() {
  return (
    <Document
      title="Dave Emanuel G. Lima — Resume"
      author="Dave Emanuel G. Lima"
      subject="Software engineer"
    >
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{resumeIdentity.name}</Text>
        <Text style={styles.contact}>
          Iloilo City, Iloilo, Philippines ·{" "}
          <Link src="mailto:daveemanuel.lima@wvsu.edu.ph" style={styles.contactLink}>
            daveemanuel.lima@wvsu.edu.ph
          </Link>
          {" · "}
          <Link src="https://github.com/DeybLims" style={styles.contactLink}>
            github.com/DeybLims
          </Link>
          {" · "}
          <Link src="https://davelims.vercel.app" style={styles.contactLink}>
            davelims.vercel.app
          </Link>
        </Text>
        <View style={styles.rule} />

        <Text style={styles.sectionLabel}>SUMMARY</Text>
        <Text style={styles.summary}>{resumeSummary}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WORK EXPERIENCE</Text>
          {resumeJobs.map((job) => (
            <View key={job.role + job.company} style={styles.job}>
              <View style={styles.roleRow}>
                <RichText style={styles.role}>{job.role}</RichText>
                {job.dates ? <Text style={styles.dates}>{job.dates}</Text> : null}
              </View>
              <Text style={styles.org}>
                {job.company}
                {job.location ? ` — ${job.location}` : ""}
              </Text>
              {job.bullets.map((bullet) => (
                <Bullet key={bullet}>{bullet}</Bullet>
              ))}
              {job.projects.length ? <Text style={styles.projectsLabel}>Projects</Text> : null}
              {job.projects.map((project) => (
                <Bullet key={project}>{project}</Bullet>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SKILLS</Text>
          {resumeSkillGroups.map((group) => (
            <Text key={group.title} style={styles.skill}>
              <Text style={styles.skillName}>{group.title} — </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REFERENCES</Text>
          <Text>{resumeReferences}</Text>
        </View>
      </Page>
    </Document>
  );
}

const out = path.join(process.cwd(), "public/Dave_Lima_Resume.pdf");

renderToFile(<ResumeDocument />, out).then(() => {
  console.log(`Wrote ${out}`);
});
