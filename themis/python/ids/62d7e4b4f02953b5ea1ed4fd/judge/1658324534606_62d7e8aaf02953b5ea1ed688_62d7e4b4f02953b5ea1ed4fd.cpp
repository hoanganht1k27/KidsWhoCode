#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 2e5 + 25, MODE = 200;
int n, res = 0, cnt[200];
pair<int, int> a[N];

void Read()
{
    cin >> n;
    for(int i = 1; i <= n; i++)
    {
        cin >> a[i].first;
        a[i].first %= MODE;
        a[i].second = i;
    }
}

void Solve()
{
    sort(a + 1, a + 1 + n);

    for(int i = 1; i <= n; i++)
        cnt[a[i].first]++;

    for(int i = 0; i <= 199; i++)
        res += (cnt[i] - 1) * cnt[i] / 2;

    cout << res;
}

main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    Read();

    Solve();

    return 0;
}
