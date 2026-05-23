import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const REVIEWS_API = '/api/reviews';

function getApiBase() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return '';
}

export default function ReviewScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState({});

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBase()}${REVIEWS_API}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Missing field', 'Please enter a comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${getApiBase()}${REVIEWS_API}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: 'Anonymous',
          rating,
          comment: comment.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit review');
      }
      setComment('');
      setRating(5);
      await fetchReviews();
      Alert.alert('Thank you!', 'Your review has been submitted.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Reviews and Comments</Text>
        <Text style={styles.subtitle}>
          Share your experience with AgriAI Insights
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Leave a Review</Text>

          <Text style={styles.label}>Rating</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={[styles.star, n <= rating && styles.starActive]}>
                  {n <= rating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Comment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your review..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          {loading ? 'Loading reviews...' : `All Reviews (${reviews.length})`}
        </Text>

        {loading ? (
          <ActivityIndicator color="#2E7D32" style={{ marginTop: 20 }} />
        ) : reviews.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No reviews yet. Be the first to share your experience!
            </Text>
          </View>
        ) : (
          reviews.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.reviewCard}
              activeOpacity={0.7}
              onPress={() => setExpanded((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
            >
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewStars}>{renderStars(r.rating)}</Text>
              </View>
              {expanded[r.id] && (
                <Text style={styles.reviewComment}>{r.comment}</Text>
              )}
              {!expanded[r.id] && (
                <Text style={styles.tapHint}>Tap to read</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F1F8E9' },
  page: { paddingBottom: 40 },
  inner: {
    maxWidth: Platform.select({ web: 720, default: undefined }),
    alignSelf: Platform.select({ web: 'center', default: undefined }),
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heading: {
    fontSize: Platform.select({ web: 28, default: 22 }),
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#558B2F',
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#33691E',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F9FBE7',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#C5E1A5',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  star: {
    fontSize: 32,
    color: '#C5E1A5',
  },
  starActive: {
    color: '#F9A825',
  },
  submitBtn: {
    backgroundColor: '#2E7D32',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  },
  reviewStars: {
    fontSize: 16,
    color: '#F9A825',
  },
  reviewComment: {
    fontSize: 14,
    color: '#37474F',
    lineHeight: 21,
    marginTop: 10,
  },
  tapHint: {
    fontSize: 12,
    color: '#90A4AE',
    fontStyle: 'italic',
    marginTop: 6,
  },
});
