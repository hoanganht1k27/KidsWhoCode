#include <bits/stdc++.h>
#define int long long
using namespace std;

int cnt[200000];

int f(int x) {
	return x * (x - 1);
}

signed main() {
	memset(cnt, 0, 200000);
	int n;
	cin >> n;
	int a[n];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
		a[i] = a[i] % 200;
	}
	int ans = 0;
	for (int i = 0; i < n; i++) {
		cnt[a[i]]++;
	}
	for (int i = 0; i < 200000; i++) {
		ans += f(cnt[i]);
	}
	cout << ans / 2;
	return 0;
}