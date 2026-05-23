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
    desc: 'Crop baseline × regional multiplier × soil × rainfall × fertilizer with a confidence score. No black box.',
  },
  {
    icon: '🗺️',
    title: 'Six-zone yield index',
    desc: 'NW, NE, NC, SW, SE, SS. Each zone carries its own rainfall norm and yield multiplier.',
  },
  {
    icon: '📶',
    title: 'Offline-first mobile UX',
    desc: 'Predictions cached on-device via AsyncStorage. Stays useful when the cellular signal drops.',
  },
  {
    icon: '⚡',
    title: 'Async FastAPI backend',
    desc: 'Sub-millisecond JSON serialisation, type-safe Pydantic v2 validation, auto-generated OpenAPI docs.',
  },
];

function ReviewCards({ reviews }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.reviewsGrid}>
      {reviews.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={styles.reviewCard}
          activeOpacity={0.7}
          onPress={() => toggle(r.id)}
        >
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewStars}>
              {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
            </Text>
            <Text style={styles.reviewDate}>
              {new Date(r.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {expanded[r.id] && (
            <Text style={styles.reviewComment}>{r.comment}</Text>
          )}
          {!expanded[r.id] && (
            <Text style={styles.reviewTapHint}>Tap to read</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getApiBase() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return '';
}

export default function HomeScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(true);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    let mounted = true;
    ApiService.getCurrentSeason()
      .then((data) => { if (mounted) setSeason(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingSeason(false); });

    fetch(`${getApiBase()}/api/reviews`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { if (mounted) setRecentReviews(data.slice(0, 6)); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingReviews(false); });

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
          ₦50 000 Android phone, closing the information gap that costs Nigeria an estimated
          ₦3.5 trillion in lost crop value every year.
        </Text>
        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => navigation.navigate('Prediction')}
        >
          <Text style={styles.heroBtnText}>Get Started</Text>
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
            Nigerian agriculture employs over 36 million smallholder farmers, roughly 70% of the
            national labour force, yet operates without the satellite, soil-sensor, and ML-driven
            yield forecasts taken for granted elsewhere. AgriAI exists to change that.
          </Text>
        </View>

        {/* ── What's Inside ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>WHAT'S INSIDE</Text>
          <Text style={styles.sectionTitle}>Built for the realities{'\n'}of rural deployment.</Text>
          <Text style={styles.sectionBody}>
            Every design decision is grounded in field constraints: patchy connectivity, low-end
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
          <TouchableOpacity
            style={[styles.secondaryBtn, { marginTop: 12 }]}
            onPress={() => navigation.navigate('Reviews')}
          >
            <Text style={styles.secondaryBtnText}>Reviews and Comments</Text>
          </TouchableOpacity>
        </View>

        {/* ── Reviews & Comments ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>WHAT FARMERS ARE SAYING</Text>
          <Text style={styles.sectionTitle}>Reviews and Comments</Text>
          {loadingReviews ? (
            <ActivityIndicator color="#2E7D32" style={{ marginTop: 12 }} />
          ) : recentReviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Text style={styles.emptyReviewsText}>
                No reviews yet. Be the first to share your experience!
              </Text>
            </View>
          ) : (
            <ReviewCards reviews={recentReviews} />
          )}
          <TouchableOpacity
            style={styles.reviewsCta}
            onPress={() => navigation.navigate('Reviews')}
          >
            <Text style={styles.reviewsCtaText}>View All Reviews & Leave a Comment</Text>
          </TouchableOpacity>
        </View>

        {/* ── Open Source banner ────────────────────────────── */}
        <View style={styles.openSourceBanner}>
          <Text style={styles.openSourceTitle}>Open source. Fork it. Self-host it.</Text>
          <Text style={styles.openSourceBody}>
            Built explicitly to be a citable reference for African agritech research.
            The source code is open. Pull requests welcome.
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
          <Text style={styles.footerUniversity}>Abia State University</Text>
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

  /* ── Reviews section ─────────────────────────────────────── */
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  reviewCard: {
    width: Platform.select({ web: 'calc(50% - 7px)', default: '100%' }),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewStars: {
    fontSize: 15,
    color: '#F9A825',
  },
  reviewComment: {
    fontSize: 13,
    color: '#37474F',
    lineHeight: 20,
    marginTop: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: '#90A4AE',
  },
  reviewTapHint: {
    fontSize: 12,
    color: '#90A4AE',
    fontStyle: 'italic',
    marginTop: 6,
  },
  emptyReviews: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyReviewsText: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
  },
  reviewsCta: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    alignSelf: Platform.select({ web: 'flex-start', default: 'stretch' }),
  },
  reviewsCtaText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 14,
  },

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
  footerUniversity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
    marginTop: 14,
    textAlign: Platform.select({ web: 'left', default: 'center' }),
  },
});
