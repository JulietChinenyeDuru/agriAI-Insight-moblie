import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ApiService from '../services/ApiService';

const STATS = [
  { number: '36M+', label: 'Nigerian smallholder\nfarmers' },
  { number: '₦3.5T', label: 'Annual crop\nvalue lost' },
  { number: '36 + FCT', label: 'States covered\nend-to-end' },
  { number: '10', label: 'Staple crops\nmodelled' },
];

const FEATURES = [
  {
    icon: '🧠',
    title: 'Interpretable AI engine',
    desc: 'Crop baseline × regional multiplier × soil × rainfall × fertilizer — with a confidence score. No black box.',
  },
  {
    icon: '🗺️',
    title: 'Six-zone yield index',
    desc: 'NW · NE · NC · SW · SE · SS — each zone carries its own rainfall norm and yield multiplier.',
  },
  {
    icon: '📶',
    title: 'Offline-first mobile UX',
    desc: 'Predictions cached on-device via AsyncStorage — stays useful when the cellular signal drops.',
  },
  {
    icon: '⚡',
    title: 'Async FastAPI backend',
    desc: 'Sub-millisecond JSON serialisation, type-safe Pydantic v2 validation, auto-generated OpenAPI docs.',
  },
];

export default function HomeScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(true);

  useEffect(() => {
    let mounted = true;
    ApiService.getCurrentSeason()
      .then((data) => { if (mounted) setSeason(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingSeason(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>OPEN SOURCE · OFFLINE-FIRST · PRIVACY-FIRST</Text>
        </View>
        <Text style={styles.heroWordmark}>AgriAI</Text>
        <Text style={styles.heroHeadline}>AI yield intelligence{'\n'}for Nigerian farmers.</Text>
        <Text style={styles.heroBody}>
          A region-aware crop yield model directly in the hand of any smallholder farmer with a
          ₦50 000 Android phone — closing the information gap that costs Nigeria an estimated
          ₦3.5 trillion in lost crop value every year.
        </Text>
        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => navigation.navigate('Prediction')}
        >
          <Text style={styles.heroBtnText}>Get a Free Yield Prediction →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <View style={styles.statsStrip}>
        {STATS.map((s, i) => (
          <View
            key={s.number}
            style={[styles.statCell, i < STATS.length - 1 && styles.statCellBorder]}
          >
            <Text style={styles.statNumber}>{s.number}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Inner (constrained on wide screens) ──────────────── */}
      <View style={styles.inner}>

        {/* Season banner */}
        {(loadingSeason || season) ? (
          <View style={styles.seasonCard}>
            {loadingSeason ? (
              <ActivityIndicator color="#2E7D32" />
            ) : (
              <>
                <Text style={styles.seasonEyebrow}>CURRENT FARMING SEASON</Text>
                <Text style={styles.seasonTitle}>{season.label}</Text>
                <Text style={styles.seasonMeta}>
                  {season.months} · Primary crops: {season.primary_crops.join(', ')}
                </Text>
              </>
            )}
          </View>
        ) : null}

        {/* ── The Problem ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>THE PROBLEM</Text>
          <Text style={styles.sectionTitle}>An information gap,{'\n'}not an effort gap.</Text>
          <Text style={styles.sectionBody}>
            Nigerian agriculture employs over 36 million smallholder farmers — roughly 70% of the
            national labour force — yet operates without the satellite, soil-sensor, and ML-driven
            yield forecasts taken for granted elsewhere. AgriAI exists to change that.
          </Text>
        </View>

        {/* ── What's Inside ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>WHAT'S INSIDE</Text>
          <Text style={styles.sectionTitle}>Built for the realities{'\n'}of rural deployment.</Text>
          <Text style={styles.sectionBody}>
            Every design decision is grounded in field constraints — patchy connectivity, low-end
            Android devices, and locally distinct agronomic conditions across six geopolitical zones.
          </Text>
          <View style={styles.featureGrid}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA ───────────────────────────────────────────── */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Ready to predict your yield?</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Prediction')}
          >
            <Text style={styles.primaryBtnText}>Start New Prediction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.secondaryBtnText}>View Saved Predictions</Text>
          </TouchableOpacity>
        </View>

        {/* ── Open Source banner ────────────────────────────── */}
        <View style={styles.openSourceBanner}>
          <Text style={styles.openSourceTitle}>Open source. Fork it. Self-host it.</Text>
          <Text style={styles.openSourceBody}>
            Built explicitly to be a citable reference for African agritech research.
            The source code is open — pull requests welcome.
          </Text>
        </View>

        {/* ── Footer ────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerWordmark}>AgriAI Insights</Text>
          <Text style={styles.footerTagline}>
            Open source · Built for Nigerian smallholder farmers
          </Text>
          <Text style={styles.footerContact}>
            Maintainer: Juliet Chinenye Duru · durujulietchinenye@gmail.com
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            Farm data belongs to the farmer. AgriAI does not collect names,
            phone numbers, or GPS coordinates.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F1F8E9' },
  page: {},

  /* ── Hero ─────────────────────────────────────────────────── */
  hero: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: Platform.select({ web: '10%', default: 24 }),
    paddingTop: Platform.select({ web: 72, default: 48 }),
    paddingBottom: Platform.select({ web: 72, default: 48 }),
    alignItems: Platform.select({ web: 'flex-start', default: 'center' }),
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 18,
  },
  heroBadgeText: {
    color: '#A5D6A7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  heroWordmark: {
    fontSize: Platform.select({ web: 72, default: 52 }),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: Platform.select({ web: 80, default: 60 }),
  },
  heroHeadline: {
    fontSize: Platform.select({ web: 28, default: 20 }),
    fontWeight: '700',
    color: '#C8E6C9',
    marginTop: 6,
    marginBottom: 16,
    textAlign: Platform.select({ web: 'left', default: 'center' }),
  },
  heroBody: {
    fontSize: 14,
    color: '#81C784',
    lineHeight: 22,
    marginBottom: 28,
    textAlign: Platform.select({ web: 'left', default: 'center' }),
    maxWidth: Platform.select({ web: 560, default: undefined }),
  },
  heroBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: Platform.select({ web: 'flex-start', default: 'stretch' }),
  },
  heroBtnText: { color: '#1B5E20', fontWeight: '800', fontSize: 15 },

  /* ── Stats strip ──────────────────────────────────────────── */
  statsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  statCell: {
    width: Platform.select({ web: '25%', default: '50%' }),
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statCellBorder: {
    borderRightWidth: 1,
    borderRightColor: '#E8F5E9',
  },
  statNumber: {
    fontSize: Platform.select({ web: 34, default: 26 }),
    fontWeight: '800',
    color: '#1B5E20',
  },
  statLabel: {
    fontSize: 11,
    color: '#558B2F',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },

  /* ── Inner wrapper ────────────────────────────────────────── */
  inner: {
    maxWidth: Platform.select({ web: 960, default: undefined }),
    alignSelf: Platform.select({ web: 'center', default: undefined }),
    width: '100%',
    paddingHorizontal: 20,
  },

  /* ── Season card ──────────────────────────────────────────── */
  seasonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  seasonEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#558B2F',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  seasonTitle: { fontSize: 18, fontWeight: '700', color: '#1B5E20', marginBottom: 4 },
  seasonMeta: { fontSize: 13, color: '#546E7A' },

  /* ── Sections ─────────────────────────────────────────────── */
  section: { paddingVertical: 28 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#558B2F',
    letterSpacing: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Platform.select({ web: 30, default: 24 }),
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 12,
    lineHeight: Platform.select({ web: 40, default: 32 }),
  },
  sectionBody: {
    fontSize: 14,
    color: '#37474F',
    lineHeight: 22,
    marginBottom: 20,
  },

  /* ── Feature grid ─────────────────────────────────────────── */
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: Platform.select({ web: 'calc(50% - 8px)', default: '100%' }),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#1B5E20', marginBottom: 6 },
  featureDesc: { fontSize: 13, color: '#37474F', lineHeight: 19 },

  /* ── CTA block ────────────────────────────────────────────── */
  ctaBlock: {
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: '#DCEDC8',
    alignItems: Platform.select({ web: 'flex-start', default: 'stretch' }),
  },
  ctaTitle: { fontSize: 20, fontWeight: '700', color: '#1B5E20', marginBottom: 18 },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    width: Platform.select({ web: 320, default: undefined }),
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    width: Platform.select({ web: 320, default: undefined }),
  },
  secondaryBtnText: { color: '#2E7D32', fontWeight: '700', fontSize: 16 },

  /* ── Open source banner ───────────────────────────────────── */
  openSourceBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  openSourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  openSourceBody: {
    fontSize: 13,
    color: '#37474F',
    lineHeight: 20,
  },

  /* ── Footer ───────────────────────────────────────────────── */
  footer: {
    paddingTop: 28,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderTopColor: '#DCEDC8',
    alignItems: Platform.select({ web: 'flex-start', default: 'center' }),
  },
  footerWordmark: { fontSize: 18, fontWeight: '800', color: '#1B5E20', marginBottom: 6 },
  footerTagline: { fontSize: 12, color: '#558B2F', marginBottom: 10 },
  footerContact: {
    fontSize: 12,
    color: '#546E7A',
    marginBottom: 14,
    textAlign: Platform.select({ web: 'left', default: 'center' }),
  },
  footerLink: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 14,
    textDecorationLine: 'underline',
  },
  footerNote: {
    fontSize: 11,
    color: '#78909C',
    lineHeight: 16,
    textAlign: Platform.select({ web: 'left', default: 'center' }),
    maxWidth: Platform.select({ web: 480, default: undefined }),
  },
});
